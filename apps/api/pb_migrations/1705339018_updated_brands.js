/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h78a4ythfxor51")

  // remove
  collection.schema.removeField("fkfwtvt6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nle53jvb",
    "name": "active",
    "type": "bool",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h78a4ythfxor51")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fkfwtvt6",
    "name": "active",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("nle53jvb")

  return dao.saveCollection(collection)
})
