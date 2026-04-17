/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bqk9lwswphh9p69")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ub5adfne",
    "name": "dark_text",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bqk9lwswphh9p69")

  // remove
  collection.schema.removeField("ub5adfne")

  return dao.saveCollection(collection)
})
