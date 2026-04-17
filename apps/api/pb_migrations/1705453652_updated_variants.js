/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eib1hgyr",
    "name": "thumbnail",
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
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  // remove
  collection.schema.removeField("eib1hgyr")

  return dao.saveCollection(collection)
})
