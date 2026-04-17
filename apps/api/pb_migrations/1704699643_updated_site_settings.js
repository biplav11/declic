/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ei921aek4r7bit4")

  // remove
  collection.schema.removeField("wffhqwgd")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ei921aek4r7bit4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wffhqwgd",
    "name": "test",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  return dao.saveCollection(collection)
})
