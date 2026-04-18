/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm2hnquo4sdou9v")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cwvh8otv",
    "name": "body_type",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "gkaqzn4gugoayyu",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm2hnquo4sdou9v")

  // remove
  collection.schema.removeField("cwvh8otv")

  return dao.saveCollection(collection)
})
