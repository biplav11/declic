/// <reference path="../pb_data/types.d.ts" />

// Allow authed admins-collection records (super/editor) to manage auth-only
// fields (verified, emailVisibility) on other admins records. Without a
// manageRule, only the built-in PB superuser can touch those fields, which
// breaks the Users > Admins / Users > Editors drawers for users logged in via
// the admins collection.

const MANAGE_RULE = '@request.auth.collectionName = "admins"';

migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("admins");
  const options = collection.options || {};
  options.manageRule = MANAGE_RULE;
  collection.options = options;
  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("admins");
  const options = collection.options || {};
  options.manageRule = null;
  collection.options = options;
  return dao.saveCollection(collection);
});
