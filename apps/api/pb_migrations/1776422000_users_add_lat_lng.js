/// <reference path="../pb_data/types.d.ts" />

// Adds lat/lng number fields to the users collection so dealerships can be
// geocoded on maps. Idempotent — skips fields that already exist (the same
// columns may have been added live via the admin API).

migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("users");

  const has = (name) => collection.schema.getFieldByName(name);

  if (!has("lat")) {
    collection.schema.addField(new SchemaField({
      system: false,
      id: "users_lat",
      name: "lat",
      type: "number",
      required: false,
      presentable: false,
      unique: false,
      options: { min: null, max: null, noDecimal: false },
    }));
  }

  if (!has("lng")) {
    collection.schema.addField(new SchemaField({
      system: false,
      id: "users_lng",
      name: "lng",
      type: "number",
      required: false,
      presentable: false,
      unique: false,
      options: { min: null, max: null, noDecimal: false },
    }));
  }

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("users");
  if (collection.schema.getFieldByName("lat")) collection.schema.removeField("users_lat");
  if (collection.schema.getFieldByName("lng")) collection.schema.removeField("users_lng");
  return dao.saveCollection(collection);
});
