#!/usr/bin/env node
// Populate models.body_types for models imported from automobile.tn.
// Reads the checkpoint to get (brand.slug, model.slug) → modelId, picks the
// first imported variant per model, fetches its page, pulls the JSON-LD
// bodyType field, maps French → body_types catalog id, and updates the model.
//
// Safe to re-run: only updates models whose body_types is empty.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PocketBase from "pocketbase";

import { fetchHtml } from "./fetch.mjs";
import { parseVariantPage } from "./parse.mjs";
import { normalizeKey } from "./upload.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CHECKPOINT_PATH = path.join(SCRIPT_DIR, "checkpoint.json");
const LOG_DIR = path.join(SCRIPT_DIR, "logs");

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";
const { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD } = process.env;

if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error("PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set.");
  process.exit(1);
}

// automobile.tn (JSON-LD "bodyType") → English body_types catalog name.
// Keys normalized via normalizeKey (accent-stripped, stop-words removed).
const BODY_TYPE_MAP = {
  berline: "SEDAN",
  suv: "SUV",
  "suv 4x4": "SUV",
  "4x4": "SUV",
  compacte: "HATCHBACK",
  citadine: "HATCHBACK",
  hatchback: "HATCHBACK",
  monospace: "MINIVAN",
  minivan: "MINIVAN",
  minibus: "MINIVAN",
  cabriolet: "CONVERTIBLE",
  convertible: "CONVERTIBLE",
  break: "WAGON",
  wagon: "WAGON",
  "pick up": "PICK UP",
  pickup: "PICK UP",
  supercar: "HYPER CAR",
  hypercar: "HYPER CAR",
};

async function appendLog(file, line) {
  await fs.mkdir(LOG_DIR, { recursive: true });
  await fs.appendFile(path.join(LOG_DIR, file), line + "\n");
}

async function main() {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);
  await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
  console.log(`Authenticated against ${PB_URL}.`);

  // Build body_types lookup by normalized English name.
  const catalog = await pb.collection("body_types").getFullList({
    fields: "id,name",
    requestKey: null,
  });
  const bodyIdByName = new Map(
    catalog.map((r) => [normalizeKey(r.name || ""), r.id])
  );
  console.log(`body_types catalog: ${catalog.length} record(s).`);

  const raw = await fs.readFile(CHECKPOINT_PATH, "utf8");
  const cp = JSON.parse(raw);
  const modelEntries = Object.entries(cp.models || {});
  const variantKeys = Object.keys(cp.variants || {});
  console.log(`Checkpoint: ${modelEntries.length} model(s), ${variantKeys.length} variant(s).`);

  const summary = {
    processed: 0,
    updated: 0,
    skippedAlreadySet: 0,
    missingVariant: 0,
    unmapped: 0,
    errors: 0,
  };

  for (const [modelKey, modelId] of modelEntries) {
    summary.processed += 1;
    try {
      const modelRec = await pb.collection("models").getOne(modelId, {
        fields: "id,name,body_types",
        requestKey: null,
      });
      if (Array.isArray(modelRec.body_types) && modelRec.body_types.length) {
        summary.skippedAlreadySet += 1;
        continue;
      }

      const variantKey = variantKeys.find((k) => k.startsWith(modelKey + "/"));
      if (!variantKey) {
        summary.missingVariant += 1;
        continue;
      }
      const url = `https://www.automobile.tn/fr/neuf/${variantKey}`;
      const html = await fetchHtml(url);
      const parsed = parseVariantPage(html);
      const bodyType = parsed.jsonLd?.bodyType;
      if (!bodyType) {
        summary.unmapped += 1;
        await appendLog("body-type-misses.log", `${modelKey} | (no JSON-LD bodyType)`);
        continue;
      }

      const frKey = normalizeKey(bodyType);
      const englishName = BODY_TYPE_MAP[frKey];
      if (!englishName) {
        summary.unmapped += 1;
        await appendLog("body-type-misses.log", `${modelKey} | ${bodyType} | (no FR→EN mapping)`);
        continue;
      }
      const bodyId = bodyIdByName.get(normalizeKey(englishName));
      if (!bodyId) {
        summary.unmapped += 1;
        await appendLog("body-type-misses.log", `${modelKey} | ${bodyType} → ${englishName} | (not in catalog)`);
        continue;
      }

      await pb.collection("models").update(modelId, { body_types: [bodyId] });
      summary.updated += 1;
      if (summary.updated % 25 === 0) {
        process.stdout.write(`\r  updated ${summary.updated} model(s)…`);
      }
    } catch (err) {
      summary.errors += 1;
      await appendLog("body-type-misses.log", `${modelKey} | ERROR: ${err.message}`);
    }
  }

  process.stdout.write("\n");
  console.log("Summary:");
  console.table(summary);
}

main().catch((err) => {
  console.error("fatal:", err);
  process.exit(1);
});
