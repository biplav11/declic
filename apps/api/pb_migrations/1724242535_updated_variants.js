/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  // remove
  collection.schema.removeField("77iy1gmh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uqcazapi",
    "name": "field",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ainp3ivfhdvm9qv",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "77iy1gmh",
    "name": "outdoor",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("uqcazapi")

  return dao.saveCollection(collection)
})
