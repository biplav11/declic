/// <reference path="../pb_data/types.d.ts" />

// Grant admins-collection authed users (both super and editor roles) access to the
// collections the admin app reads and writes. Without this, any admins-collection
// login is treated like a regular user and 403s on admin-only collections.

const TARGETS = [
  "site_settings",
  "admins",
  "finance_leads",
  "leads",
  "newsletters",
  "contact_us",
  "listings",
];

const RULE = '@request.auth.collectionName = "admins"';

migrate((db) => {
  const dao = new Dao(db);
  for (const name of TARGETS) {
    let col;
    try {
      col = dao.findCollectionByNameOrId(name);
    } catch (e) {
      continue;
    }
    col.listRule = RULE;
    col.viewRule = RULE;
    col.createRule = RULE;
    col.updateRule = RULE;
    col.deleteRule = RULE;
    dao.saveCollection(col);
  }
}, (db) => {
  const dao = new Dao(db);
  for (const name of TARGETS) {
    let col;
    try {
      col = dao.findCollectionByNameOrId(name);
    } catch (e) {
      continue;
    }
    col.listRule = null;
    col.viewRule = null;
    col.createRule = null;
    col.updateRule = null;
    col.deleteRule = null;
    dao.saveCollection(col);
  }
});
