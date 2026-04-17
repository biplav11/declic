// cheerio-based HTML parsers for the three page types we hit.

import * as cheerio from "cheerio";

const BASE = "https://www.automobile.tn";

// The brand index (and every brand page) embeds a JS call
//     facets.setOriginalAttributes({ ... })
// whose payload contains a full brand→model map. Pulling this out once is a lot
// more reliable than parsing scattered anchor grids.
export function parseBrandIndex(html) {
  const $ = cheerio.load(html);
  const facets = extractFacetsPayload(html);
  const brandIndex = facets?.brand || {};

  const brands = [];
  // Walk anchors on the landing grid so we get canonical slugs + images.
  $('a[href^="/fr/neuf/"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const parts = href.split("/").filter(Boolean); // ["fr","neuf","<slug>"...]
    if (parts.length !== 3 || parts[0] !== "fr" || parts[1] !== "neuf") return;
    const slug = parts[2];
    if (/^(electrique|comparateur|concessionnaires|devis|occasion)$/.test(slug)) return;
    if (brands.find((b) => b.slug === slug)) return;

    const img =
      $(el).find("picture img").attr("src") ||
      $(el).find("img").attr("src") ||
      null;
    const alt = $(el).find("img").attr("alt") || "";

    let displayName = alt;
    // facets payload has entries shaped like "Audi (10)" — strip the count.
    const fromFacet = brandIndex[slug];
    if (fromFacet) displayName = fromFacet.replace(/\s*\(\d+\)\s*$/, "");

    if (!img) return; // skip the non-brand tiles that slipped the path check

    brands.push({
      slug,
      name: displayName || slug,
      imageUrl: absolute(img),
    });
  });

  return brands;
}

// On a brand page (e.g. /fr/neuf/bmw) the `facets.setOriginalAttributes` payload
// contains model.slug → "Display Name (count)" under `model.<brand>`.
export function parseBrandPage(html, brandSlug) {
  const $ = cheerio.load(html);
  const facets = extractFacetsPayload(html);
  const fromFacet = facets?.model?.[brandSlug] || {};

  const models = [];

  $("div.versions-item").each((_, el) => {
    const href = $(el).find("a[href]").first().attr("href") || "";
    const parts = href.split("/").filter(Boolean); // ["fr","neuf","brand","model"]
    if (parts.length < 4) return;
    const slug = parts[3];
    if (models.find((m) => m.slug === slug)) return;

    const $pic = $(el).find("picture img").first();
    const thumbnailUrl = $pic.attr("src") || null;
    const h2 = $(el).find("h2").first().text().trim();
    const priceStr = $(el).find(".price").text().trim();
    const startingPrice = extractPriceTnd(priceStr);

    // Prefer the facet-provided clean name (strips "(count)"); fall back to h2.
    let name = fromFacet[slug] ? fromFacet[slug].replace(/\s*\(\d+\)\s*$/, "") : null;
    if (!name) {
      // h2 is "BMW Série 3" — strip the brand prefix so we store "Série 3"
      name = h2.replace(new RegExp(`^${escapeRe(brandDisplay(facets, brandSlug))}\\s*`, "i"), "").trim() || h2;
    }

    models.push({
      slug,
      name,
      thumbnailUrl: thumbnailUrl ? absolute(thumbnailUrl) : null,
      startingPrice,
    });
  });

  return models;
}

// On a model page the variant links appear as /fr/neuf/<brand>/<model>/<variant>
// Some anchors include URL fragments (`#specs`, `#photos`) pointing at sections
// of the same variant page; those are not distinct variants, so strip them.
export function parseModelPage(html, brandSlug, modelSlug) {
  const $ = cheerio.load(html);
  const variants = [];
  $(`a[href^="/fr/neuf/${brandSlug}/${modelSlug}/"]`).each((_, el) => {
    const raw = $(el).attr("href");
    const href = raw.split("#")[0].split("?")[0];
    const parts = href.split("/").filter(Boolean); // fr neuf brand model variant
    if (parts.length !== 5) return;
    const slug = parts[4];
    if (!slug || variants.find((v) => v.slug === slug)) return;
    variants.push({ slug, url: `${BASE}${href}` });
  });
  return variants;
}

// Variant page: JSON-LD "Car" schema gives the main facts; the "Fiche technique"
// tables fill the rest; each equipment category is its own <table> by section
// header.
export function parseVariantPage(html) {
  const $ = cheerio.load(html);

  const jsonLd = extractCarJsonLd(html);

  const specs = {};
  $("section table, .c-versions table, body table").each((_, tbl) => {
    const sectionHeader = $(tbl).find("thead th[colspan]").first().text().trim();
    if (!sectionHeader) return;
    const rows = {};
    $(tbl)
      .find("tbody tr")
      .each((_, tr) => {
        const label = $(tr).find("th").first().text().trim();
        const value = $(tr).find("td").first().text().replace(/\s+/g, " ").trim();
        if (!label) return;
        rows[label] = value;
      });
    if (Object.keys(rows).length) specs[sectionHeader] = rows;
  });

  // Gallery: all unique /max/ image URLs in the page body.
  const gallery = new Set();
  const hero = jsonLd?.image ? stripQuery(jsonLd.image) : null;
  $("img, source").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("srcset") || "";
    const match = src.match(/https:\/\/catalogue\.automobile\.tn\/max\/[^"\s]+?\.(jpg|jpeg|png|webp)/);
    if (match) gallery.add(stripQuery(match[0]));
  });

  const pageTitle = ($("title").text() || "").trim();
  // "Prix BMW Série 3 320i Business Line neuve - 184 900 DT"
  const titleMatch = pageTitle.match(/^Prix\s+(.+?)\s+neuve\s*-\s*([\d\s]+)\s*DT/i);
  const fullName = titleMatch ? titleMatch[1].trim() : jsonLd?.name || null;
  const priceFromTitle = titleMatch
    ? Number(titleMatch[2].replace(/\s/g, ""))
    : null;

  return {
    fullName,
    jsonLd,
    specs,
    gallery: Array.from(gallery),
    hero,
    priceTnd: priceFromTitle ?? jsonLd?.offers?.price ?? null,
  };
}

// -------- helpers --------

function extractFacetsPayload(html) {
  // matches: facets.setOriginalAttributes({...big JSON...})
  const m = html.match(/facets\.setOriginalAttributes\((\{[\s\S]*?\})\)/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

function extractCarJsonLd(html) {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    try {
      const json = JSON.parse(m[1]);
      if (json["@type"] === "Car") return json;
    } catch {
      // keep scanning
    }
  }
  return null;
}

function brandDisplay(facets, brandSlug) {
  const raw = facets?.brand?.[brandSlug] || brandSlug;
  return raw.replace(/\s*\(\d+\)\s*$/, "");
}

function absolute(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${BASE}${url}`;
  return url;
}

function stripQuery(url) {
  return url.split("?")[0];
}

function extractPriceTnd(s) {
  // "à partir de 184 900 DT" → 184900
  const m = s && s.match(/([\d][\d\s]*)\s*DT/);
  if (!m) return null;
  const n = Number(m[1].replace(/\s/g, ""));
  return Number.isFinite(n) ? n : null;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
