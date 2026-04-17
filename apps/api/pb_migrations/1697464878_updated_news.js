/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("36d533ws4knvy9l")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tko9j7mo",
    "name": "show_in_hero",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("36d533ws4knvy9l")

  // remove
  collection.schema.removeField("tko9j7mo")

  return dao.saveCollection(collection)
})
