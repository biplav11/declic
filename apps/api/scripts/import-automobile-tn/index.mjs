#!/usr/bin/env node
// Full brand/model/variant catalogue import from automobile.tn → PocketBase.
// Resumable via checkpoint.json. Failures logged, not fatal.
//
// Required env: PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD (a PB superuser)
// Optional env:
//   PB_URL                     default http://127.0.0.1:8090
//   IMPORT_BRAND_LIMIT         restrict number of brands processed
//   IMPORT_MODEL_LIMIT         restrict number of models per brand processed
//   IMPORT_VARIANT_LIMIT       restrict number of variants per model processed
//   IMPORT_BRAND_FILTER        comma-separated list of brand slugs (bmw,audi)
//   IMPORT_RESET_CHECKPOINT=1  ignore existing checkpoint

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PocketBase from "pocketbase";

import { fetchHtml } from "./fetch.mjs";
import {
  parseBrandIndex,
  parseBrandPage,
  parseModelPage,
  parseVariantPage,
} from "./parse.mjs";
import {
  buildCatalogMap,
  normalizeKey,
  upsertBrand,
  upsertModel,
  upsertVariant,
} from "./upload.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.join(SCRIPT_DIR, "logs");
const CHECKPOINT_PATH = path.join(SCRIPT_DIR, "checkpoint.json");
const MAP_PATH = path.join(SCRIPT_DIR, "equipment-map.json");

const BASE = "https://www.automobile.tn";
const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";

const BRAND_LIMIT = intEnv("IMPORT_BRAND_LIMIT");
const MODEL_LIMIT = intEnv("IMPORT_MODEL_LIMIT");
const VARIANT_LIMIT = intEnv("IMPORT_VARIANT_LIMIT");
const BRAND_FILTER = (process.env.IMPORT_BRAND_FILTER || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const RESET = process.env.IMPORT_RESET_CHECKPOINT === "1";

function intEnv(name) {
  const v = process.env[name];
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function ensureAuth(pb) {
  const email = process.env.PB_ADMIN_EMAIL;
  const password = process.env.PB_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set.");
  }
  await pb.admins.authWithPassword(email, password);
}

async function loadCheckpoint() {
  if (RESET) {
    try { await fs.unlink(CHECKPOINT_PATH); } catch {}
    return { brands: {}, models: {}, variants: {} };
  }
  try {
    const raw = await fs.readFile(CHECKPOINT_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return { brands: {}, models: {}, variants: {} };
  }
}

async function saveCheckpoint(cp) {
  await fs.writeFile(CHECKPOINT_PATH, JSON.stringify(cp, null, 2));
}

async function appendLog(file, line) {
  await fs.mkdir(LOG_DIR, { recursive: true });
  await fs.appendFile(path.join(LOG_DIR, file), line + "\n");
}

// ----- field mappers (FR → PB select values) -----

function mapEnergy(fr) {
  const s = normalizeKey(fr);
  if (!s) return null;
  if (s.includes("essence") && s.includes("hybride") && s.includes("rechargeable"))
    return "Plug-in Hybrid Gasoline";
  if (s.includes("essence") && s.includes("hybride")) return "Hybrid Gasoline";
  if (s.includes("diesel") && s.includes("hybride") && s.includes("rechargeable"))
    return "Plug-in Hybrid Diesel";
  if (s.includes("diesel") && s.includes("hybride")) return "Hybrid Diesel";
  if (s.includes("electrique") || s.includes("electric")) return "Electric";
  if (s.includes("diesel")) return "Diesel";
  if (s.includes("essence")) return "Petrol";
  if (s.includes("hybride rechargeable")) return "Plug-in Hybrid Gasoline";
  if (s.includes("hybride")) return "Hybrid Gasoline";
  return null;
}

function mapTransmission(fr) {
  const s = normalizeKey(fr);
  if (!s) return null;
  if (s.includes("automatique") || s.includes("automatic")) return "Automatic";
  if (s.includes("manuel") || s.includes("manual")) return "Manual";
  return null;
}

function extractIntValue(s) {
  if (!s) return null;
  const m = String(s).match(/-?\d+/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

function extractGuaranteeYears(s) {
  if (!s) return null;
  // "5 ans (2+3)" → 5
  const m = String(s).match(/(\d+)\s*ans?/i);
  return m ? Number(m[1]) : null;
}

// Walk every equipment row on the variant page and resolve it to the best
// category the catalog supports. Source's section categorization is loose
// (e.g. "Allumage automatique des feux" appears under Sécurité on one variant
// and Fonctionnel on another), so we try the label against each FR→EN map
// starting from the section's own, falling back to the others. Returns a
// grouped result plus any unmatched French labels.
function resolveAllEquipment(specs, frEnMaps, catalogMaps) {
  const SECTION_KEYS = [
    { key: "safety", headerHints: ["securite"] },
    { key: "outdoor", headerHints: ["exterieur"] },
    { key: "interior", headerHints: ["interieur"] },
    { key: "functional", headerHints: ["fonctionnel"] },
  ];

  const result = { safety: [], outdoor: [], interior: [], functional: [] };
  const seen = { safety: new Set(), outdoor: new Set(), interior: new Set(), functional: new Set() };
  const misses = [];

  for (const section of SECTION_KEYS) {
    const rows = pickEquipmentSection(specs, "equipements", ...section.headerHints);
    if (!rows) continue;
    for (const label of Object.keys(rows)) {
      const key = normalizeKey(label);
      // Priority: section's own map, then every other section's map.
      const order = [section.key, ...SECTION_KEYS.map((s) => s.key).filter((k) => k !== section.key)];
      let matched = null;
      for (const target of order) {
        const englishName = frEnMaps[target]?.[key];
        if (!englishName) continue;
        const id = catalogMaps[target].get(normalizeKey(englishName));
        if (!id) continue;
        matched = { target, id };
        break;
      }
      if (matched) {
        if (!seen[matched.target].has(matched.id)) {
          result[matched.target].push(matched.id);
          seen[matched.target].add(matched.id);
        }
      } else {
        misses.push({ section: section.key, label });
      }
    }
  }
  return { ...result, misses };
}

function pickEquipmentSection(specs, ...keywords) {
  for (const header of Object.keys(specs)) {
    const norm = normalizeKey(header);
    if (keywords.every((k) => norm.includes(normalizeKey(k)))) return specs[header];
  }
  return null;
}

function uniqueSlug(base, modelSlug, seen) {
  if (!seen.has(base)) return base;
  return `${modelSlug}-${base}`;
}

// ----- main orchestration -----

async function main() {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);
  await ensureAuth(pb);
  console.log(`Authenticated against ${PB_URL}.`);

  const [frEnMap, safetyMap, outdoorMap, interiorMap, functionalMap] =
    await Promise.all([
      fs.readFile(MAP_PATH, "utf8").then(JSON.parse),
      buildCatalogMap(pb, "safety"),
      buildCatalogMap(pb, "outdoor"),
      buildCatalogMap(pb, "interior"),
      buildCatalogMap(pb, "functional"),
    ]);
  console.log(
    `Catalogs: ${safetyMap.size} safety, ${outdoorMap.size} outdoor, ${interiorMap.size} interior, ${functionalMap.size} functional.`
  );

  const checkpoint = await loadCheckpoint();
  process.on("SIGINT", async () => {
    console.log("\nInterrupted — saving checkpoint…");
    await saveCheckpoint(checkpoint);
    process.exit(130);
  });

  // 1. Brand discovery
  const indexHtml = await fetchHtml(`${BASE}/fr/neuf`);
  let brands = parseBrandIndex(indexHtml);
  if (BRAND_FILTER.length) {
    brands = brands.filter((b) => BRAND_FILTER.includes(b.slug));
  }
  if (BRAND_LIMIT) brands = brands.slice(0, BRAND_LIMIT);
  console.log(`Discovered ${brands.length} brand(s).`);

  const summary = {
    brands: 0,
    models: 0,
    variants: 0,
    missedEquipment: 0,
    failures: 0,
  };

  for (const brand of brands) {
    try {
      console.log(`\n[${brand.name}] …`);
      let brandRec;
      if (checkpoint.brands[brand.slug]) {
        brandRec = { id: checkpoint.brands[brand.slug] };
      } else {
        brandRec = await upsertBrand(pb, { name: brand.name, imageUrl: brand.imageUrl });
        checkpoint.brands[brand.slug] = brandRec.id;
        await saveCheckpoint(checkpoint);
      }
      summary.brands += 1;

      const brandHtml = await fetchHtml(`${BASE}/fr/neuf/${brand.slug}`);
      let models = parseBrandPage(brandHtml, brand.slug);
      if (MODEL_LIMIT) models = models.slice(0, MODEL_LIMIT);
      console.log(`  ${models.length} model(s).`);

      for (const model of models) {
        const modelKey = `${brand.slug}/${model.slug}`;
        try {
          let modelRec;
          if (checkpoint.models[modelKey]) {
            modelRec = { id: checkpoint.models[modelKey] };
          } else {
            modelRec = await upsertModel(pb, {
              name: model.name,
              brandId: brandRec.id,
              thumbnailUrl: model.thumbnailUrl,
            });
            checkpoint.models[modelKey] = modelRec.id;
            await saveCheckpoint(checkpoint);
          }
          summary.models += 1;

          const modelHtml = await fetchHtml(`${BASE}/fr/neuf/${brand.slug}/${model.slug}`);
          let variantLinks = parseModelPage(modelHtml, brand.slug, model.slug);
          if (VARIANT_LIMIT) variantLinks = variantLinks.slice(0, VARIANT_LIMIT);

          const slugSeen = new Set();
          for (const variant of variantLinks) {
            const variantKey = `${brand.slug}/${model.slug}/${variant.slug}`;
            if (checkpoint.variants[variantKey]) {
              slugSeen.add(variant.slug);
              continue;
            }
            try {
              const html = await fetchHtml(variant.url);
              const parsed = parseVariantPage(html);

              const specs = parsed.specs || {};
              const charac = specs["Caractéristiques"] || {};
              const motor = specs["Motorisation"] || {};
              const trans = specs["Transmission"] || {};

              const energy = mapEnergy(motor["Energie"] || motor["Energie "]);
              const transmission = mapTransmission(trans["Boîte"]);
              const year = extractIntValue(parsed.jsonLd?.vehicleModelDate);
              const horsepower = extractIntValue(motor["Puissance (ch.din)"]);
              const seats = extractIntValue(charac["Nombre de places"]);
              const doors = extractIntValue(charac["Nombre de portes"]);
              const guarantee = extractGuaranteeYears(charac["Garantie"]);
              const availability =
                charac["Disponibilité"]?.toLowerCase().includes("disponible")
                  ? "Available"
                  : "Unavailable";

              // Equipment — resolve via cross-section lookup.
              const resolved = resolveAllEquipment(
                specs,
                {
                  safety: frEnMap.safety || {},
                  outdoor: frEnMap.outdoor || {},
                  interior: frEnMap.interior || {},
                  functional: frEnMap.functional || {},
                },
                {
                  safety: safetyMap,
                  outdoor: outdoorMap,
                  interior: interiorMap,
                  functional: functionalMap,
                }
              );
              const safetyIds = resolved.safety;
              const outdoorIds = resolved.outdoor;
              const interiorIds = resolved.interior;
              const functionalIds = resolved.functional;
              for (const miss of resolved.misses) {
                summary.missedEquipment += 1;
                appendLog(
                  "missing-mappings.log",
                  `${miss.section} | ${variantKey} | ${miss.label}`
                );
              }

              const baseSlug = variant.slug;
              const slug = uniqueSlug(baseSlug, model.slug, slugSeen);
              slugSeen.add(slug);

              const title =
                parsed.fullName ||
                parsed.jsonLd?.name ||
                `${brand.name} ${model.name} ${variant.slug}`;

              const modelRecObj = await pb
                .collection("models")
                .getOne(modelRec.id, { requestKey: null });

              await upsertVariant(pb, {
                slug,
                title,
                modelId: modelRecObj.id,
                price: parsed.priceTnd,
                year,
                horsepower,
                seats,
                doors,
                energy: energy || "Petrol",
                transmission,
                availability,
                guarantee,
                thumbnailUrl: parsed.hero,
                galleryUrls: parsed.gallery,
                safety: safetyIds,
                outdoor: outdoorIds,
                interior: interiorIds,
                functional: functionalIds,
              });
              checkpoint.variants[variantKey] = true;
              summary.variants += 1;
              process.stdout.write(
                `    ✓ ${variant.slug} (${parsed.priceTnd ?? "-"} DT)\n`
              );
            } catch (err) {
              summary.failures += 1;
              console.error(`    ✗ variant ${variantKey}: ${err.message}`);
              await appendLog(
                "failures.log",
                `variant | ${variantKey} | ${err.status || ""} | ${err.message}`
              );
            }
          }
          await saveCheckpoint(checkpoint);
        } catch (err) {
          summary.failures += 1;
          console.error(`  ✗ model ${modelKey}: ${err.message}`);
          await appendLog("failures.log", `model | ${modelKey} | ${err.message}`);
        }
      }
    } catch (err) {
      summary.failures += 1;
      console.error(`✗ brand ${brand.slug}: ${err.message}`);
      await appendLog("failures.log", `brand | ${brand.slug} | ${err.message}`);
    }
  }

  await saveCheckpoint(checkpoint);
  console.log("\nSummary:");
  console.table(summary);
  console.log(
    `Missing equipment entries logged to ${path.relative(process.cwd(), path.join(LOG_DIR, "missing-mappings.log"))}`
  );
  console.log(
    `Failures logged to ${path.relative(process.cwd(), path.join(LOG_DIR, "failures.log"))}`
  );
}

main().catch((err) => {
  console.error("fatal:", err);
  process.exit(1);
});
