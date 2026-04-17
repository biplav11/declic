#!/usr/bin/env node
// One-shot wipe of all records in a fixed list of collections.
// Requires PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD of a PB superuser (bypasses
// per-collection rules). Does NOT drop the collections — only their rows.

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";
const { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD } = process.env;

if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error("PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set.");
  process.exit(1);
}

const COLLECTIONS = [
  "brands",
  "contact_us",
  "dealership_address",
  "finance_leads",
  "leads",
  "listings",
  "models",
  "news",
  "newsletters",
  "pages",
  "variants",
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

async function pageRecords(collection, token, page = 1) {
  const params = new URLSearchParams({ page: String(page), perPage: "200", fields: "id" });
  const res = await fetch(`${PB_URL}/api/collections/${collection}/records?${params}`, {
    headers: { Authorization: token },
  });
  if (!res.ok) throw new Error(`fetch ${collection} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function deleteOne(collection, id, token) {
  const res = await fetch(`${PB_URL}/api/collections/${collection}/records/${id}`, {
    method: "DELETE",
    headers: { Authorization: token },
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`delete ${collection}/${id} failed: ${res.status} ${await res.text()}`);
  }
}

async function wipeCollection(collection, token) {
  let totalDeleted = 0;
  // Always refetch page 1; after deletes page 1 is always the next chunk.
  // Stop when server reports 0 items remaining.
  while (true) {
    const body = await pageRecords(collection, token, 1);
    const items = body.items || [];
    if (items.length === 0) break;
    for (const item of items) {
      await deleteOne(collection, item.id, token);
      totalDeleted += 1;
      if (totalDeleted % 50 === 0) {
        process.stdout.write(`\r  ${collection}: deleted ${totalDeleted}...`);
      }
    }
  }
  process.stdout.write(`\r  ${collection}: deleted ${totalDeleted} record(s).\n`);
  return totalDeleted;
}

async function main() {
  const token = await authAdmin();
  console.log(`Authenticated as ${PB_ADMIN_EMAIL}. Wiping ${COLLECTIONS.length} collections.`);
  const summary = {};
  for (const c of COLLECTIONS) {
    try {
      summary[c] = await wipeCollection(c, token);
    } catch (err) {
      console.error(`  ${c}: ERROR — ${err.message}`);
      summary[c] = `error: ${err.message}`;
    }
  }
  console.log("\nSummary:");
  for (const [c, n] of Object.entries(summary)) {
    console.log(`  ${c.padEnd(22)} ${n}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
