/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("36d533ws4knvy9l")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "drw36lkq",
    "name": "category_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "tjl4qog33nar1of",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("36d533ws4knvy9l")

  // remove
  collection.schema.removeField("drw36lkq")

  return dao.saveCollection(collection)
})
