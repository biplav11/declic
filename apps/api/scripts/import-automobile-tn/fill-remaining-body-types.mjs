#!/usr/bin/env node
// For any `models` record that still has no body_types after the mapper run,
// assign a randomly-chosen body_type from the catalog. Per user request.

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

const catalog = await pb.collection("body_types").getFullList({
  fields: "id,name",
  requestKey: null,
});
const catalogIds = catalog.map((r) => r.id);
console.log(`body_types catalog: ${catalog.length} record(s).`);

const models = await pb.collection("models").getFullList({
  fields: "id,name,body_types",
  requestKey: null,
});
const empty = models.filter(
  (m) => !Array.isArray(m.body_types) || m.body_types.length === 0
);
console.log(`${empty.length} model(s) without a body_type (of ${models.length} total).`);

let updated = 0;
const tally = {};
for (const m of empty) {
  const pick = catalogIds[Math.floor(Math.random() * catalogIds.length)];
  await pb.collection("models").update(m.id, { body_types: [pick] });
  const label = catalog.find((r) => r.id === pick)?.name || pick;
  tally[label] = (tally[label] || 0) + 1;
  updated += 1;
}
console.log(`Assigned ${updated} random body_type(s). Distribution:`);
console.table(tally);
