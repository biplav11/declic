#!/usr/bin/env node
// Bulk-insert catalog rows into the safety / outdoor / interior / functional
// collections. Skips any name already present (case-insensitive), so re-running
// is idempotent.
//
// Requires PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD (PB superuser).

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";
const { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD } = process.env;

if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error("PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set.");
  process.exit(1);
}

const SAFETY = [
  "ABS",
  "Front airbags",
  "Side airbags",
  "Curtain airbags",
  "Intrusion alarm",
  "Electronic immobilizer",
  "Anti-slip",
  "Tire pressure monitoring",
  "ISOFIX fixings",
  "Run-flat tires",
  "Tropicalized radiator",
];

const OUTDOOR = [
  "Rearview camera",
  "360 Cameras",
  "Electric safe",
  "Alloy wheels",
  "Reversing radar",
  "Metallic paint",
  "LED lights",
  "Xenon headlights",
  "Full LED headlights",
  "Fog lights",
  "Headlight Washers",
  "Sunroof",
  "Panoramic roof",
  "Tinted windows",
];

const INTERIOR = [
  "Front armrest",
  "Rear armrest",
  "Heads-up display",
  "Car radio",
  "Car Radio CD Player",
  "Car radio CD/MP3",
  "Apple CarPlay",
  "Android Auto",
  "Bluetooth",
  "Refrigerated glove box",
  "CD changer",
  "Connectivity: Aux, USB, iPod",
  "Navigation",
  "Paddle shifters",
  "Sport seats",
  "Heated seats",
  "Massage seats",
  "Ventilated seats",
  "Height-adjustable seats",
  "Electric seats",
  "Tinted windows",
  "Leather steering wheel/gear shifter",
  "Multi-function steering wheel",
  "3 rear headrests",
  "Height/depth adjustable steering wheel",
  "Heated steering wheel",
  "Digital instrumentation",
];

const FUNCTIONAL = [
  "Automatic headlight activation",
  "Keyless access",
  "Start & Stop Button",
  "Air Conditioning",
  "Automatic climate control",
  "Power steering",
  "Rain sensor",
  "Central locking",
  "On-board computer",
  "Cruise control",
  "Semi-autonomous driving",
  "Electric mirrors",
  "Folding mirrors",
  "Electric windows",
  "Air suspension",
  "Parkassis",
];

const GROUPS = [
  { collection: "safety", items: SAFETY },
  { collection: "outdoor", items: OUTDOOR },
  { collection: "interior", items: INTERIOR },
  { collection: "functional", items: FUNCTIONAL },
];

async function authAdmin() {
  const res = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: PB_ADMIN_EMAIL, password: PB_ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`auth failed: ${res.status} ${await res.text()}`);
  return (await res.json()).token;
}

async function fetchExistingNames(collection, token) {
  const names = new Set();
  let page = 1;
  while (true) {
    const params = new URLSearchParams({ page: String(page), perPage: "200", fields: "name" });
    const res = await fetch(`${PB_URL}/api/collections/${collection}/records?${params}`, {
      headers: { Authorization: token },
    });
    if (!res.ok) throw new Error(`list ${collection} failed: ${res.status} ${await res.text()}`);
    const body = await res.json();
    for (const r of body.items || []) if (r.name) names.add(r.name.toLowerCase());
    if (!body.items || body.items.length < 200) break;
    page += 1;
  }
  return names;
}

async function createRecord(collection, name, token) {
  const res = await fetch(`${PB_URL}/api/collections/${collection}/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`create ${collection}/${name} failed: ${res.status} ${await res.text()}`);
}

async function seedGroup(group, token) {
  const existing = await fetchExistingNames(group.collection, token);
  let created = 0;
  let skipped = 0;
  for (const name of group.items) {
    if (existing.has(name.toLowerCase())) {
      skipped += 1;
      continue;
    }
    await createRecord(group.collection, name, token);
    created += 1;
  }
  console.log(`  ${group.collection.padEnd(12)} created ${created}, skipped ${skipped}`);
}

async function main() {
  const token = await authAdmin();
  console.log(`Authenticated as ${PB_ADMIN_EMAIL}. Seeding equipment catalogs.`);
  for (const g of GROUPS) await seedGroup(g, token);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
