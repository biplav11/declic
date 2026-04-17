/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("36d533ws4knvy9l")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vsmbwc5o",
    "name": "show_in_index",
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
  collection.schema.removeField("vsmbwc5o")

  return dao.saveCollection(collection)
})
