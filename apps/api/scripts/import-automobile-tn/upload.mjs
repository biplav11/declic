// PB-facing upsert helpers. Keeps the `index.mjs` orchestrator readable.

import { fetchBuffer, filenameFromUrl } from "./fetch.mjs";

// Idempotent brand upsert keyed by name (case-insensitive).
// Uploads the brand logo on create; on update we only replace the image if the
// existing record has none.
export async function upsertBrand(pb, { name, imageUrl }) {
  const existing = await findByFilter(pb, "brands", `name ~ "${escapeFilter(name)}"`);
  if (existing) {
    if (!existing.image && imageUrl) {
      const fd = new FormData();
      await attachImage(fd, "image", imageUrl);
      return pb.collection("brands").update(existing.id, fd);
    }
    return existing;
  }
  const fd = new FormData();
  fd.set("name", name);
  if (imageUrl) await attachImage(fd, "image", imageUrl);
  return pb.collection("brands").create(fd);
}

// Model upsert keyed by (name, brand). Updates thumbnail only when empty.
export async function upsertModel(pb, { name, brandId, thumbnailUrl }) {
  const filter = `name ~ "${escapeFilter(name)}" && brand = "${brandId}"`;
  const existing = await findByFilter(pb, "models", filter);
  if (existing) {
    if (!existing.thumbnail && thumbnailUrl) {
      const fd = new FormData();
      await attachImage(fd, "thumbnail", thumbnailUrl);
      return pb.collection("models").update(existing.id, fd);
    }
    return existing;
  }
  const fd = new FormData();
  fd.set("name", name);
  fd.set("brand", brandId);
  if (thumbnailUrl) await attachImage(fd, "thumbnail", thumbnailUrl);
  return pb.collection("models").create(fd);
}

// Variant upsert keyed by (slug, model). Slug uniqueness across models isn't
// guaranteed by the source ("base" etc.), so we scope by model too.
export async function upsertVariant(pb, payload) {
  const {
    slug,
    title,
    modelId,
    price,
    year,
    horsepower,
    seats,
    doors,
    energy,
    transmission,
    availability,
    guarantee,
    thumbnailUrl,
    galleryUrls,
    safety,
    outdoor,
    interior,
    functional,
  } = payload;

  const filter = `slug = "${escapeFilter(slug)}" && model = "${modelId}"`;
  const existing = await findByFilter(pb, "variants", filter);

  const fd = new FormData();
  fd.set("slug", slug);
  fd.set("title", title);
  fd.set("model", modelId);
  if (price != null) fd.set("price", String(price));
  if (year != null) fd.set("year", String(year));
  if (horsepower != null) fd.set("horsepower", String(horsepower));
  if (seats != null) fd.set("seats", String(seats));
  if (doors != null) fd.set("doors", String(doors));
  if (energy) fd.set("energy", energy);
  if (transmission) fd.set("transmission", transmission);
  if (availability) fd.set("availability", availability);
  if (guarantee != null) fd.set("guarantee", String(guarantee));

  for (const id of safety || []) fd.append("safety", id);
  for (const id of outdoor || []) fd.append("outdoor", id);
  for (const id of interior || []) fd.append("interior", id);
  for (const id of functional || []) fd.append("functional", id);

  // Image uploads are expensive; do them only on create so re-runs are cheap.
  if (!existing) {
    if (thumbnailUrl) await attachImage(fd, "thumbnail", thumbnailUrl);
    for (const url of galleryUrls || []) {
      await attachImage(fd, "gallery", url);
    }
    return pb.collection("variants").create(fd);
  }
  return pb.collection("variants").update(existing.id, fd);
}

// Returns a `{normalizedName → recordId}` map for a catalog collection.
export async function buildCatalogMap(pb, collection) {
  const rows = await pb.collection(collection).getFullList({
    fields: "id,name",
    requestKey: null,
  });
  const map = new Map();
  for (const r of rows) {
    map.set(normalizeKey(r.name || ""), r.id);
  }
  return map;
}

// French stop-words we strip before matching. Helps "Feux à LED" vs "feux led".
const FR_STOPWORDS = new Set([
  "a", "au", "aux", "de", "des", "du", "d",
  "et", "ou", "en",
  "le", "la", "les", "l",
  "un", "une",
  "pour", "par",
]);

export function normalizeKey(s) {
  const stripped = (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  return stripped
    .split(/\s+/)
    .filter((w) => w && !FR_STOPWORDS.has(w))
    .join(" ");
}

// -------- helpers --------

async function findByFilter(pb, collection, filter) {
  try {
    return await pb.collection(collection).getFirstListItem(filter, {
      requestKey: null,
    });
  } catch (err) {
    if (err?.status === 404) return null;
    throw err;
  }
}

async function attachImage(fd, field, url) {
  const { buffer, contentType } = await fetchBuffer(url);
  const name = filenameFromUrl(url);
  const blob = new Blob([buffer], { type: contentType });
  fd.append(field, blob, name);
}

function escapeFilter(s) {
  return String(s).replace(/"/g, '\\"');
}
