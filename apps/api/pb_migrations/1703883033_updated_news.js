/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("36d533ws4knvy9l")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yqkgchzz",
    "name": "published",
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
  collection.schema.removeField("yqkgchzz")

  return dao.saveCollection(collection)
})
