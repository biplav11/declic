/// <reference path="../pb_data/types.d.ts" />

// Open every active collection to the public on all five CRUD rules.
// Temporary state: we'll tighten per-collection in follow-up migrations.
// Down restores the pre-consolidation rule state captured from migration
// history as of 2026-04-17.

const ADMIN = '@request.auth.collectionName = "admins"';
const PUBLIC = "";

const TARGETS = [
  // auth
  "users",
  "admins",
  // public-read content
  "pages",
  "sliders",
  "social_links",
  "site_settings",
  "brands",
  "models",
  "variants",
  "body_types",
  "interior",
  "outdoor",
  "functional",
  "safety",
  "news",
  "news_categories",
  "listings",
  // forms
  "newsletters",
  "contact_us",
  "leads",
  "finance_leads",
  // subscriptions
  "magazine",
  "magazine_subscriptions",
  // internal
  "alerts",
  "admin_role",
  "images",
];

const DOWN = {
  users: {
    listRule: "id = @request.auth.id",
    viewRule: null, createRule: null, updateRule: null, deleteRule: null,
    manageRule: null,
  },
  admins: {
    listRule: ADMIN, viewRule: ADMIN, createRule: ADMIN, updateRule: ADMIN, deleteRule: ADMIN,
    manageRule: ADMIN,
  },
  site_settings: { listRule: ADMIN, viewRule: ADMIN, createRule: ADMIN, updateRule: ADMIN, deleteRule: ADMIN },
  finance_leads: { listRule: ADMIN, viewRule: ADMIN, createRule: ADMIN, updateRule: ADMIN, deleteRule: ADMIN },
  leads:         { listRule: ADMIN, viewRule: ADMIN, createRule: ADMIN, updateRule: ADMIN, deleteRule: ADMIN },
  newsletters:   { listRule: ADMIN, viewRule: ADMIN, createRule: ADMIN, updateRule: ADMIN, deleteRule: ADMIN },
  contact_us:    { listRule: ADMIN, viewRule: ADMIN, createRule: ADMIN, updateRule: ADMIN, deleteRule: ADMIN },
  listings:      { listRule: ADMIN, viewRule: ADMIN, createRule: ADMIN, updateRule: ADMIN, deleteRule: ADMIN },
  magazine_subscriptions: {
    listRule: ADMIN, viewRule: ADMIN, createRule: ADMIN, updateRule: ADMIN, deleteRule: ADMIN,
  },
  pages:  { listRule: "", viewRule: "", createRule: null, updateRule: null, deleteRule: null },
  models: { listRule: "", viewRule: "", createRule: null, updateRule: null, deleteRule: null },
  brands:          { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  variants:        { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  body_types:      { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  interior:        { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  outdoor:         { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  functional:      { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  safety:          { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  news:            { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  news_categories: { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  sliders:         { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  social_links:    { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  magazine:        { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  alerts:          { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  admin_role:      { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
  images:          { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null },
};

const AUTH_COLLECTIONS = ["users", "admins"];

migrate((db) => {
  const dao = new Dao(db);
  for (const name of TARGETS) {
    let col;
    try {
      col = dao.findCollectionByNameOrId(name);
    } catch (e) {
      continue;
    }
    col.listRule = PUBLIC;
    col.viewRule = PUBLIC;
    col.createRule = PUBLIC;
    col.updateRule = PUBLIC;
    col.deleteRule = PUBLIC;
    if (AUTH_COLLECTIONS.indexOf(name) !== -1) {
      const opts = col.options || {};
      opts.manageRule = PUBLIC;
      col.options = opts;
    }
    dao.saveCollection(col);
  }
}, (db) => {
  const dao = new Dao(db);
  for (const name of Object.keys(DOWN)) {
    let col;
    try {
      col = dao.findCollectionByNameOrId(name);
    } catch (e) {
      continue;
    }
    const rules = DOWN[name];
    col.listRule = rules.listRule;
    col.viewRule = rules.viewRule;
    col.createRule = rules.createRule;
    col.updateRule = rules.updateRule;
    col.deleteRule = rules.deleteRule;
    if ("manageRule" in rules) {
      const opts = col.options || {};
      opts.manageRule = rules.manageRule;
      col.options = opts;
    }
    dao.saveCollection(col);
  }
});
