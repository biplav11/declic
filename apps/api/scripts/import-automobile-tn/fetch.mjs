// HTTP + image fetching with throttle & retry.
// Exposes a shared concurrency gate so calls from everywhere respect one limit.

const UA =
  "DeclicImporter/1.0 (+https://declic.tn; contact: admin@declic.tn)";

const DEFAULT_CONCURRENCY = Number(process.env.SCRAPE_CONCURRENCY || 4);
const DEFAULT_RETRY = 3;
const DEFAULT_TIMEOUT_MS = 25_000;
const POLITE_DELAY_MS = 120; // minimum spacing between starts — respectful

function createGate(max) {
  let active = 0;
  const queue = [];
  const release = () => {
    active -= 1;
    if (queue.length) {
      active += 1;
      queue.shift()();
    }
  };
  return {
    async acquire() {
      if (active < max) {
        active += 1;
      } else {
        await new Promise((r) => queue.push(r));
      }
      await new Promise((r) => setTimeout(r, POLITE_DELAY_MS));
      return release;
    },
  };
}

const gate = createGate(DEFAULT_CONCURRENCY);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchWithRetry(url, options = {}) {
  const { retries = DEFAULT_RETRY, timeoutMs = DEFAULT_TIMEOUT_MS, ...init } =
    options;
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const release = await gate.acquire();
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        ...init,
        signal: controller.signal,
        headers: {
          "User-Agent": UA,
          "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.7",
          ...(init.headers || {}),
        },
      });
      if (res.status >= 500 || res.status === 429) {
        throw new Error(`status ${res.status}`);
      }
      if (!res.ok) {
        // 4xx (other than 429) — no retry, fail fast.
        const body = await res.text().catch(() => "");
        const err = new Error(`${url} → ${res.status} ${res.statusText}`);
        err.status = res.status;
        err.body = body;
        throw err;
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt === retries) break;
      const backoff = 500 * Math.pow(2, attempt) + Math.floor(Math.random() * 400);
      await sleep(backoff);
    } finally {
      clearTimeout(t);
      release();
    }
  }
  throw lastErr;
}

export async function fetchHtml(url) {
  const res = await fetchWithRetry(url);
  return res.text();
}

export async function fetchBuffer(url) {
  const res = await fetchWithRetry(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  return { buffer: buf, contentType };
}

export function filenameFromUrl(url) {
  const u = new URL(url);
  const base = u.pathname.split("/").filter(Boolean).pop() || "file";
  return base.split("?")[0];
}
