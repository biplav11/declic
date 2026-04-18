#!/usr/bin/env node
// Seeds the `listings` collection with N fake records.
// Expects PocketBase running on PB_URL (default http://127.0.0.1:8090)
// and admin creds in PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD env vars.

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL;
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;
const COUNT = Number(process.env.SEED_COUNT || 30);

if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error("PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set.");
  process.exit(1);
}

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const STATES = ["Used", "Like New", "Certified", "Available"];
const COLORS = ["red", "blue", "green", "other"];
const CONDITIONS = ["new", "excellent", "good", "fair", "poor"];
const DISPLACEMENTS = [1000, 1200, 1400, 1600, 1800, 2000, 2500, 3000];
const ADDRESSES = [
  "Tunis, Tunisia",
  "Sfax, Tunisia",
  "Sousse, Tunisia",
  "La Marsa, Tunisia",
  "Bizerte, Tunisia",
];

async function authAdmin() {
  const res = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: PB_ADMIN_EMAIL, password: PB_ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`auth failed: ${res.status} ${await res.text()}`);
  const body = await res.json();
  return body.token;
}

async function fetchAll(collection, token, opts = {}) {
  const params = new URLSearchParams({ perPage: "200", ...opts });
  const res = await fetch(`${PB_URL}/api/collections/${collection}/records?${params}`, {
    headers: { Authorization: token },
  });
  if (!res.ok) throw new Error(`fetch ${collection} failed: ${res.status} ${await res.text()}`);
  return (await res.json()).items;
}

async function createListing(token, payload) {
  const res = await fetch(`${PB_URL}/api/collections/listings/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`create failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  const token = await authAdmin();
  console.log("Authenticated.");

  const [variants, models, users, safetyItems, interiorItems, functionalItems, outdoorItems] = await Promise.all([
    fetchAll("variants", token),
    fetchAll("models", token),
    fetchAll("users", token),
    fetchAll("safety", token),
    fetchAll("interior", token),
    fetchAll("functional", token),
    fetchAll("outdoor", token),
  ]);

  console.log(
    `Have ${variants.length} variants, ${models.length} models, ${users.length} users, ` +
    `${safetyItems.length} safety, ${interiorItems.length} interior, ` +
    `${functionalItems.length} functional, ${outdoorItems.length} outdoor.`
  );
  if (variants.length === 0 || models.length === 0) {
    throw new Error("Need at least one variant and one model before seeding listings.");
  }

  const sample = (arr, min, max) => {
    const n = Math.min(arr.length, randInt(min, max));
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n).map((r) => r.id);
  };

  const created = [];
  for (let i = 0; i < COUNT; i++) {
    const variant = rand(variants);
    const model = rand(models);
    const user = users.length ? rand(users) : null;
    const year = randInt(2015, 2024);
    const price = randInt(8000, 75000);
    const mileage = randInt(5000, 180000);

    const payload = {
      state: rand(STATES),
      price: `${price} TND`,
      variant: variant.id,
      model: model.id,
      year,
      mileage: `${mileage} km`,
      address: rand(ADDRESSES),
      phone: `+216 ${randInt(20, 99)} ${randInt(100, 999)} ${randInt(100, 999)}`,
      safety: sample(safetyItems, 5, 6),
      interior: sample(interiorItems, 5, 6),
      outdoor: sample(outdoorItems, 5, 6),
      functional: sample(functionalItems, 5, 6),
      interior_color: rand(COLORS),
      exterior_color: rand(COLORS),
      general_condition: rand(CONDITIONS),
      previous_owners: randInt(0, 4),
      engine_displacement: rand(DISPLACEMENTS),
      ...(user ? { user: user.id } : {}),
    };

    const record = await createListing(token, payload);
    created.push(record.id);
    process.stdout.write(`\rCreated ${i + 1}/${COUNT}`);
  }
  process.stdout.write("\n");
  console.log(`Done. IDs: ${created.join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
