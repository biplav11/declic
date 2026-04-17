/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ei921aek4r7bit4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r58hxffq",
    "name": "image",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ei921aek4r7bit4")

  // remove
  collection.schema.removeField("r58hxffq")

  return dao.saveCollection(collection)
})
