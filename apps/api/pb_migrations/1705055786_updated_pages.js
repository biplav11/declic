/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3m2z4jabx3208q3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cmj1vwv4",
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
  const collection = dao.findCollectionByNameOrId("3m2z4jabx3208q3")

  // remove
  collection.schema.removeField("cmj1vwv4")

  return dao.saveCollection(collection)
})
