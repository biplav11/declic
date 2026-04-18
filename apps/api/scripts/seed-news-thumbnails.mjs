#!/usr/bin/env node
// Populates the `thumbnail` field on news records that don't have one.
// Uses picsum.photos as the image source.

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL;
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;
const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 675;

if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error("PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set.");
  process.exit(1);
}

async function authAdmin() {
  const res = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: PB_ADMIN_EMAIL, password: PB_ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`auth failed: ${res.status} ${await res.text()}`);
  return (await res.json()).token;
}

async function fetchAll(collection, token) {
  const res = await fetch(`${PB_URL}/api/collections/${collection}/records?perPage=200`, {
    headers: { Authorization: token },
  });
  if (!res.ok) throw new Error(`fetch ${collection} failed: ${res.status} ${await res.text()}`);
  return (await res.json()).items;
}

async function fetchImage(seed) {
  const url = `https://picsum.photos/seed/${seed}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`image fetch failed for ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "image/jpeg";
  return { buffer: buf, contentType };
}

async function attachThumbnail(token, recordId, seed) {
  const { buffer, contentType } = await fetchImage(seed);
  const blob = new Blob([buffer], { type: contentType });
  const fd = new FormData();
  fd.append("thumbnail", blob, `${seed}.jpg`);
  const res = await fetch(`${PB_URL}/api/collections/news/records/${recordId}`, {
    method: "PATCH",
    headers: { Authorization: token },
    body: fd,
  });
  if (!res.ok) throw new Error(`update failed for ${recordId}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  const token = await authAdmin();
  console.log("Authenticated.");

  const news = await fetchAll("news", token);
  const needsThumb = news.filter((r) => !r.thumbnail);
  console.log(`${news.length} news records, ${needsThumb.length} missing thumbnails.`);

  let done = 0;
  for (const r of needsThumb) {
    await attachThumbnail(token, r.id, r.id);
    done += 1;
    process.stdout.write(`\rUpdated ${done}/${needsThumb.length}`);
  }
  process.stdout.write("\n");
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
