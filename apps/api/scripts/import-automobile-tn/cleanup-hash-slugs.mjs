#!/usr/bin/env node
// One-shot cleanup: delete any `variants` records whose slug contains '#'.
// These were created before the parse.mjs fragment-stripping fix.

import PocketBase from "pocketbase";

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";
const { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD } = process.env;

if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error("PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set.");
  process.exit(1);
}

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);
await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);

const all = await pb.collection("variants").getFullList({
  fields: "id,slug",
  requestKey: null,
});
const bad = all.filter((r) => (r.slug || "").includes("#"));
console.log(`Found ${bad.length} variants with '#' in slug (of ${all.length} total).`);

let deleted = 0;
for (const r of bad) {
  try {
    await pb.collection("variants").delete(r.id);
    deleted += 1;
    if (deleted % 50 === 0) process.stdout.write(`\r  deleted ${deleted}/${bad.length}`);
  } catch (err) {
    console.error(`  delete ${r.id} (${r.slug}) failed: ${err.message}`);
  }
}
process.stdout.write(`\r  deleted ${deleted}/${bad.length}\n`);
console.log("Done.");
