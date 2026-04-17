#!/usr/bin/env node
// Updates the `magazine` collection schema (idempotent) and seeds 5 issues
// with cover images. Wipes any pre-existing magazine row first so the new
// shape is the source of truth.

import PocketBase from "pocketbase";

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";
const { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD } = process.env;

if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error("PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set.");
  process.exit(1);
}

const NEW_FIELDS = [
  {
    id: "mag_slug",
    name: "slug",
    type: "text",
    required: true,
    presentable: true,
    unique: true,
    options: { min: null, max: null, pattern: "" },
  },
  {
    id: "mag_file",
    name: "file",
    type: "file",
    required: false,
    presentable: false,
    unique: false,
    options: {
      maxSelect: 1,
      maxSize: 100 * 1024 * 1024,
      mimeTypes: ["application/pdf", "application/epub+zip"],
      thumbs: [],
      protected: false,
    },
  },
  {
    id: "mag_cover",
    name: "cover",
    type: "file",
    required: false,
    presentable: false,
    unique: false,
    options: {
      maxSelect: 1,
      maxSize: 5 * 1024 * 1024,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
      thumbs: ["400x500", "200x250"],
      protected: false,
    },
  },
  {
    id: "mag_desc",
    name: "description",
    type: "editor",
    required: false,
    presentable: false,
    unique: false,
    options: { convertUrls: false },
  },
  {
    id: "mag_tags",
    name: "tags",
    type: "json",
    required: false,
    presentable: false,
    unique: false,
    options: { maxSize: 2000 },
  },
  {
    id: "mag_meta",
    name: "meta_data",
    type: "json",
    required: false,
    presentable: false,
    unique: false,
    options: { maxSize: 5000 },
  },
  {
    id: "mag_pubat",
    name: "published_at",
    type: "date",
    required: false,
    presentable: false,
    unique: false,
    options: { min: "", max: "" },
  },
  {
    id: "mag_pub",
    name: "published",
    type: "bool",
    required: false,
    presentable: false,
    unique: false,
    options: {},
  },
];

const ISSUES = [
  {
    title: "Spring 2026 — The Electric Awakening",
    slug: "spring-2026-the-electric-awakening",
    description: `
      <p>This issue digs into the wave of new EVs landing in Tunisia this spring,
      from the BYD Seal U at Ennakl to the Renault Kwid E-Tech opening orders
      under 90 000 TND. We tour STEG's first set of public DC chargers along the
      A1, and share long-term ownership notes from three early adopters in
      Greater Tunis.</p>
    `,
    tags: ["EV", "BYD Seal U", "Renault Kwid E-Tech", "STEG", "DC Charging"],
    meta_data: {
      issue_number: 14,
      season: "Spring",
      year: 2026,
      pages: 92,
      sponsor: "Total Energies Tunisie",
      contributors: ["Sami Ben Salem", "Karim Mansouri", "Nadia Ferchichi"],
    },
    published_at: "2026-03-21",
    published: true,
    coverSeed: "mag-spring-2026",
  },
  {
    title: "Winter 2025 — Year of the Plug-in Hybrid",
    slug: "winter-2025-year-of-the-plug-in-hybrid",
    description: `
      <p>2025 ended as the year PHEVs broke into the Tunisian mainstream. We
      compare the Peugeot 408 PHEV, BMW Série 3 Hybride, and the freshly-arrived
      X1 Hybride head-to-head on the Hammamet loop. Plus an in-depth interview
      with Stafim's general manager on the state of the market.</p>
    `,
    tags: ["PHEV", "Peugeot 408", "BMW Série 3", "BMW X1", "Comparison"],
    meta_data: {
      issue_number: 13,
      season: "Winter",
      year: 2025,
      pages: 84,
      sponsor: "Stafim",
      contributors: ["Mehdi Khelifa", "Amina Dieng"],
    },
    published_at: "2025-12-12",
    published: true,
    coverSeed: "mag-winter-2025",
  },
  {
    title: "Autumn 2025 — Cap Bon Tour Special",
    slug: "autumn-2025-cap-bon-tour-special",
    description: `
      <p>A 300 km weekend loop from La Marsa through Korbous, Sidi Daoud, and
      back via the freshly-resurfaced GP1. We took along three convertibles —
      the Mini Cooper S, BMW Z4, and Mazda MX-5 — to see which offers the best
      open-air experience on Cap Bon's twisty coastal roads.</p>
    `,
    tags: ["Convertible", "Mini", "BMW Z4", "Mazda MX-5", "Cap Bon", "Travel"],
    meta_data: {
      issue_number: 12,
      season: "Autumn",
      year: 2025,
      pages: 96,
      sponsor: "Hertz Tunisie",
      contributors: ["Karim Mansouri", "Youssef Trabelsi"],
    },
    published_at: "2025-09-19",
    published: true,
    coverSeed: "mag-autumn-2025",
  },
  {
    title: "Summer 2025 — Heat & Range Test",
    slug: "summer-2025-heat-and-range-test",
    description: `
      <p>How do today's EVs really perform when the mercury hits 42°C? We took
      five battery-electric crossovers across a 600 km figure-of-eight from
      Tunis to Tozeur and back, measuring real-world range, charging speed
      degradation, and cabin cooling load. The results may surprise you.</p>
    `,
    tags: ["EV", "Range Test", "Summer", "Charging", "Tozeur"],
    meta_data: {
      issue_number: 11,
      season: "Summer",
      year: 2025,
      pages: 88,
      sponsor: "Bridgestone",
      contributors: ["Nadia Ferchichi", "Sami Ben Salem"],
    },
    published_at: "2025-06-27",
    published: true,
    coverSeed: "mag-summer-2025",
  },
  {
    title: "Spring 2025 — Tunisian Auto Show Recap",
    slug: "spring-2025-tunisian-auto-show-recap",
    description: `
      <p>50 brands, 240 stands, and 60 000 visitors over five days at Parc des
      Expositions du Kram. We bring you everything you need to know from the
      2025 edition, including the local debut of GAC Aion, Lynk &amp; Co's
      brand-new showroom plans, and the seven concept cars unveiled by
      Wallyscar.</p>
    `,
    tags: ["Auto Show", "Tunis", "GAC Aion", "Wallyscar", "Lynk & Co"],
    meta_data: {
      issue_number: 10,
      season: "Spring",
      year: 2025,
      pages: 100,
      sponsor: "Parc des Expositions du Kram",
      contributors: ["Mamadou Sarr", "Fatou Ndiaye", "Mehdi Khelifa"],
    },
    published_at: "2025-03-14",
    published: true,
    coverSeed: "mag-spring-2025",
  },
];

async function ensureSchema(pb) {
  const col = await pb.collections.getOne("magazine");
  const haveByName = new Map(col.schema.map((f) => [f.name, f]));

  const newSchema = [...col.schema];
  let modified = false;

  // Promote title to required if it isn't already.
  const title = haveByName.get("title");
  if (title && !title.required) {
    title.required = true;
    modified = true;
  }

  // Drop the legacy `field` (date) if still present.
  const idxField = newSchema.findIndex((f) => f.name === "field");
  if (idxField >= 0) {
    newSchema.splice(idxField, 1);
    modified = true;
  }

  for (const f of NEW_FIELDS) {
    if (!haveByName.has(f.name)) {
      newSchema.push(f);
      modified = true;
    }
  }

  if (modified) {
    await pb.collections.update(col.id, { schema: newSchema });
    console.log("Magazine schema updated.");
  } else {
    console.log("Magazine schema already up to date.");
  }
}

async function wipeExistingRecords(pb) {
  const rows = await pb.collection("magazine").getFullList({
    fields: "id",
    requestKey: null,
  });
  for (const r of rows) {
    await pb.collection("magazine").delete(r.id);
  }
  if (rows.length) console.log(`Removed ${rows.length} pre-existing magazine row(s).`);
}

async function fetchCover(seed) {
  const url = `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/1000.jpg`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`cover ${seed} → ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function seedIssues(pb) {
  let created = 0;
  for (const issue of ISSUES) {
    const fd = new FormData();
    fd.set("title", issue.title);
    fd.set("slug", issue.slug);
    fd.set("description", issue.description.trim());
    fd.set("tags", JSON.stringify(issue.tags));
    fd.set("meta_data", JSON.stringify(issue.meta_data));
    fd.set("published_at", issue.published_at);
    fd.set("published", issue.published ? "true" : "false");

    try {
      const buf = await fetchCover(issue.coverSeed);
      const blob = new Blob([buf], { type: "image/jpeg" });
      fd.append("cover", blob, `${issue.slug}.jpg`);
    } catch (err) {
      console.warn(`  cover for ${issue.slug}: ${err.message} (continuing without cover)`);
    }

    await pb.collection("magazine").create(fd);
    created += 1;
    console.log(`  ✓ ${issue.slug}`);
  }
  return created;
}

async function main() {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);
  await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
  console.log(`Authenticated against ${PB_URL}.`);

  console.log("\nUpdating magazine schema…");
  await ensureSchema(pb);

  console.log("\nWiping any pre-existing magazine rows…");
  await wipeExistingRecords(pb);

  console.log("\nSeeding 5 issues…");
  const n = await seedIssues(pb);
  console.log(`\nDone. ${n} issue(s) created.`);
}

main().catch((err) => {
  console.error("fatal:", err);
  if (err?.data) console.error("details:", err.data);
  process.exit(1);
});
