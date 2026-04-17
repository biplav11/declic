/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h78a4ythfxor51")

  // remove
  collection.schema.removeField("1iq87fdc")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0txgkkpm",
    "name": "image",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h78a4ythfxor51")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1iq87fdc",
    "name": "image",
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

  // remove
  collection.schema.removeField("0txgkkpm")

  return dao.saveCollection(collection)
})
