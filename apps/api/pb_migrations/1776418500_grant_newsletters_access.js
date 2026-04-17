/// <reference path="../pb_data/types.d.ts" />

// Earlier rules migration targeted "newsletter" (singular) but the collection
// was renamed to "newsletters" (plural) long ago, so the update silently
// skipped it. This migration adds the admins-collection access rule to the
// actual collection name.

const RULE = '@request.auth.collectionName = "admins"';

migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("newsletters");
  collection.listRule = RULE;
  collection.viewRule = RULE;
  collection.createRule = RULE;
  collection.updateRule = RULE;
  collection.deleteRule = RULE;
  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("newsletters");
  collection.listRule = null;
  collection.viewRule = null;
  collection.createRule = null;
  collection.updateRule = null;
  collection.deleteRule = null;
  return dao.saveCollection(collection);
});
