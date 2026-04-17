/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("v2bd2vp30auugww")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dzx4ns2e",
    "name": "brand",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "9h78a4ythfxor51",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("v2bd2vp30auugww")

  // remove
  collection.schema.removeField("dzx4ns2e")

  return dao.saveCollection(collection)
})
