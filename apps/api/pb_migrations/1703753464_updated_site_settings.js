/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ei921aek4r7bit4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uw3l3nmw",
    "name": "label",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ei921aek4r7bit4")

  // remove
  collection.schema.removeField("uw3l3nmw")

  return dao.saveCollection(collection)
})
