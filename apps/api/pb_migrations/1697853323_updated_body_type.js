/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkaqzn4gugoayyu")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "icibqsld",
    "name": "position",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkaqzn4gugoayyu")

  // remove
  collection.schema.removeField("icibqsld")

  return dao.saveCollection(collection)
})
