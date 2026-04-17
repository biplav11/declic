#!/usr/bin/env node
// - Ensures users has lat/lng columns (adds them via the admin API if missing,
//   so PB doesn't need a restart).
// - Assigns 2–4 unique brands to every dealership; no brand repeats across
//   dealerships.
// - Seeds every user with a Tunisian address + lat/lng.
//
// Requires PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD (PB superuser).

import PocketBase from "pocketbase";

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";
const { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD } = process.env;

if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error("PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set.");
  process.exit(1);
}

// Major Tunisian cities with approximate centroids.
const CITIES = [
  { name: "Tunis", lat: 36.8065, lng: 10.1815 },
  { name: "Ariana", lat: 36.8665, lng: 10.1647 },
  { name: "Ben Arous", lat: 36.7529, lng: 10.2189 },
  { name: "Manouba", lat: 36.8084, lng: 10.0963 },
  { name: "Sfax", lat: 34.7406, lng: 10.7603 },
  { name: "Sousse", lat: 35.8256, lng: 10.6411 },
  { name: "Monastir", lat: 35.7643, lng: 10.8113 },
  { name: "Nabeul", lat: 36.4560, lng: 10.7376 },
  { name: "Bizerte", lat: 37.2744, lng: 9.8739 },
  { name: "Kairouan", lat: 35.6781, lng: 10.0963 },
  { name: "Gabès", lat: 33.8881, lng: 10.0975 },
  { name: "Gafsa", lat: 34.4250, lng: 8.7842 },
  { name: "Beja", lat: 36.7256, lng: 9.1817 },
  { name: "Medenine", lat: 33.3549, lng: 10.5055 },
  { name: "Zaghouan", lat: 36.4029, lng: 10.1429 },
];

const STREET_PREFIXES = [
  "Avenue Habib Bourguiba",
  "Rue de la Liberté",
  "Avenue Mohamed V",
  "Rue Ibn Khaldoun",
  "Avenue de la République",
  "Rue El Kahena",
  "Avenue Taieb Mhiri",
  "Rue Farhat Hached",
  "Avenue 7 Novembre",
  "Avenue des Martyrs",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function jitter(n, amount = 0.02) {
  // ±~2km of lat/lng
  return Number((n + (Math.random() - 0.5) * amount).toFixed(5));
}

function makeAddress() {
  const city = pick(CITIES);
  const street = pick(STREET_PREFIXES);
  const number = randInt(1, 220);
  return {
    address: `${number} ${street}, ${city.name}, Tunisia`,
    lat: jitter(city.lat),
    lng: jitter(city.lng),
  };
}

async function ensureLatLngFields(pb) {
  const col = await pb.collections.getOne("users");
  const haveLat = col.schema.some((f) => f.name === "lat");
  const haveLng = col.schema.some((f) => f.name === "lng");
  if (haveLat && haveLng) {
    console.log("users.lat and users.lng already exist.");
    return;
  }
  const schema = [...col.schema];
  if (!haveLat) {
    schema.push({
      system: false,
      id: "users_lat",
      name: "lat",
      type: "number",
      required: false,
      presentable: false,
      unique: false,
      options: { min: null, max: null, noDecimal: false },
    });
  }
  if (!haveLng) {
    schema.push({
      system: false,
      id: "users_lng",
      name: "lng",
      type: "number",
      required: false,
      presentable: false,
      unique: false,
      options: { min: null, max: null, noDecimal: false },
    });
  }
  await pb.collections.update(col.id, { schema });
  console.log("Added lat/lng fields to users collection.");
}

async function assignBrandsToDealerships(pb) {
  const [dealerships, brands] = await Promise.all([
    pb.collection("users").getFullList({
      filter: 'role = "dealership"',
      fields: "id,name,brands",
      requestKey: null,
    }),
    pb.collection("brands").getFullList({
      fields: "id,name",
      requestKey: null,
    }),
  ]);

  if (brands.length < dealerships.length * 2) {
    throw new Error(
      `Not enough brands (${brands.length}) to give each of the ${dealerships.length} dealerships at least 2 unique brands.`
    );
  }

  // Reserve at least 2 per dealership, then distribute the remainder up to 4 each
  // while keeping the total ≤ brands.length.
  const counts = Array(dealerships.length).fill(2);
  let remaining = brands.length - dealerships.length * 2;
  // Randomize assignment order so the "leftover" boost is spread.
  const order = dealerships.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  for (const idx of order) {
    if (remaining <= 0) break;
    const extra = Math.min(remaining, 2); // max 4 total (2 + 2)
    const add = randInt(0, extra);
    counts[idx] += add;
    remaining -= add;
  }

  // Shuffle brands once, then slice.
  const pool = [...brands];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const results = [];
  let cursor = 0;
  for (let i = 0; i < dealerships.length; i++) {
    const count = counts[i];
    const picks = pool.slice(cursor, cursor + count);
    cursor += count;
    const dealer = dealerships[i];
    const brandIds = picks.map((b) => b.id);
    await pb.collection("users").update(dealer.id, { brands: brandIds });
    results.push({
      dealer: dealer.name,
      brandCount: brandIds.length,
      brands: picks.map((b) => b.name).join(", "),
    });
  }
  return results;
}

async function seedAddresses(pb) {
  const users = await pb.collection("users").getFullList({
    fields: "id,name,role",
    requestKey: null,
  });
  let updated = 0;
  for (const u of users) {
    const { address, lat, lng } = makeAddress();
    await pb.collection("users").update(u.id, { address, lat, lng });
    updated += 1;
  }
  return updated;
}

async function main() {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);
  await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
  console.log(`Authenticated against ${PB_URL}.`);

  await ensureLatLngFields(pb);

  console.log("\nAssigning unique brands to dealerships…");
  const dealerAssignments = await assignBrandsToDealerships(pb);
  console.table(dealerAssignments);

  console.log("\nSeeding addresses for all users…");
  const addrCount = await seedAddresses(pb);
  console.log(`Updated ${addrCount} user address(es).`);
}

main().catch((err) => {
  console.error("fatal:", err);
  if (err?.data) console.error("details:", err.data);
  process.exit(1);
});
