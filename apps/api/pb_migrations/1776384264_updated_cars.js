/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dk5nyu1u80f8dq7")

  // remove
  collection.schema.removeField("teg1lmrn")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dk5nyu1u80f8dq7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "teg1lmrn",
    "name": "variant",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "qwo4cqf6u02rcf6",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
