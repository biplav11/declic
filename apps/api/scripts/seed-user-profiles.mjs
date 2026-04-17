#!/usr/bin/env node
// - Creates 3 role="user" accounts if not already present.
// - For every user, fills in a missing avatar (DiceBear PNG, uploaded as file),
//   a missing or bogus phone number, and forces country_code to +221.
// Idempotent: skips avatar upload when the user already has one; regenerates
// phone only when it's blank or 0.
//
// Requires PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD (PB superuser).

import PocketBase from "pocketbase";

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";
const { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD } = process.env;

if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error("PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set.");
  process.exit(1);
}

const COUNTRY_CODE = "+221";
// Senegal mobile prefixes: 70-79, 30-33, 60-67. We'll use the common 7x block.
const MOBILE_PREFIXES = ["70", "76", "77", "78"];

function randomPhone() {
  const pref = MOBILE_PREFIXES[Math.floor(Math.random() * MOBILE_PREFIXES.length)];
  const rest = String(Math.floor(Math.random() * 10_000_000))
    .padStart(7, "0");
  // 9-digit mobile number, e.g. 77 123 4567
  return Number(pref + rest);
}

const NEW_USERS = [
  {
    email: "amina.dieng@declic.local",
    name: "Amina Dieng",
    password: "User@Password1",
  },
  {
    email: "mamadou.sarr@declic.local",
    name: "Mamadou Sarr",
    password: "User@Password1",
  },
  {
    email: "fatou.ndiaye@declic.local",
    name: "Fatou Ndiaye",
    password: "User@Password1",
  },
];

async function fetchAvatar(seed) {
  const url = `https://api.dicebear.com/8.x/adventurer/png?seed=${encodeURIComponent(seed)}&size=256`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`avatar fetch ${url} → ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function attachAvatarIfMissing(pb, user) {
  if (user.avatar) return false;
  const buf = await fetchAvatar(user.name || user.email || user.id);
  const fd = new FormData();
  const blob = new Blob([buf], { type: "image/png" });
  const fname = `${(user.username || user.id).replace(/[^a-z0-9-_]/gi, "")}.png`;
  fd.append("avatar", blob, fname);
  await pb.collection("users").update(user.id, fd);
  return true;
}

async function ensurePhoneAndCountryCode(pb, user) {
  const updates = {};
  if (user.country_code !== COUNTRY_CODE) {
    updates.country_code = COUNTRY_CODE;
  }
  if (!user.phone || user.phone === 0) {
    updates.phone = randomPhone();
  }
  if (Object.keys(updates).length) {
    await pb.collection("users").update(user.id, updates);
    return updates;
  }
  return null;
}

async function createMissingUsers(pb) {
  const created = [];
  for (const u of NEW_USERS) {
    // Does a user with this email already exist?
    let existing = null;
    try {
      existing = await pb
        .collection("users")
        .getFirstListItem(`email = "${u.email}"`, { requestKey: null });
    } catch (err) {
      if (err?.status !== 404) throw err;
    }
    if (existing) continue;

    const avatarBuf = await fetchAvatar(u.name);
    const fd = new FormData();
    fd.append("email", u.email);
    fd.append("name", u.name);
    fd.append("password", u.password);
    fd.append("passwordConfirm", u.password);
    fd.append("role", "user");
    fd.append("country_code", COUNTRY_CODE);
    fd.append("phone", String(randomPhone()));
    fd.append("emailVisibility", "true");
    fd.append("verified", "true");
    const blob = new Blob([avatarBuf], { type: "image/png" });
    fd.append("avatar", blob, `${u.email.split("@")[0]}.png`);
    await pb.collection("users").create(fd);
    created.push(u.email);
  }
  return created;
}

async function main() {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);
  await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
  console.log(`Authenticated against ${PB_URL}.`);

  console.log("\nCreating 3 role=user accounts if missing…");
  const created = await createMissingUsers(pb);
  console.log(`  created: ${created.length ? created.join(", ") : "none (already present)"}`);

  console.log("\nTopping up every existing user (avatar + phone + country_code)…");
  const users = await pb.collection("users").getFullList({
    fields: "id,name,email,username,avatar,phone,country_code,role",
    requestKey: null,
  });

  let avatarsAdded = 0;
  let contactsUpdated = 0;
  for (const u of users) {
    try {
      if (await attachAvatarIfMissing(pb, u)) avatarsAdded += 1;
    } catch (err) {
      console.warn(`  avatar ${u.email || u.id}: ${err.message}`);
    }
    try {
      if (await ensurePhoneAndCountryCode(pb, u)) contactsUpdated += 1;
    } catch (err) {
      console.warn(`  contact ${u.email || u.id}: ${err.message}`);
    }
  }
  console.log(`  avatars added:      ${avatarsAdded}`);
  console.log(`  contacts updated:   ${contactsUpdated}`);
  console.log(`  total users now:    ${users.length + created.length}`);
}

main().catch((err) => {
  console.error("fatal:", err);
  if (err?.data) console.error("details:", err.data);
  process.exit(1);
});
