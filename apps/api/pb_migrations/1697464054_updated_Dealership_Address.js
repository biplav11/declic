/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rxoy9ubcajp5b6o")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kz9miuuv",
    "name": "lat",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kjlxqnbm",
    "name": "lng",
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
  const collection = dao.findCollectionByNameOrId("rxoy9ubcajp5b6o")

  // remove
  collection.schema.removeField("kz9miuuv")

  // remove
  collection.schema.removeField("kjlxqnbm")

  return dao.saveCollection(collection)
})
