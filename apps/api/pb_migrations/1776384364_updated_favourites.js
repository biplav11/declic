/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("duvnsak1og9vfkj")

  // remove
  collection.schema.removeField("c1ygbdxe")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("duvnsak1og9vfkj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "c1ygbdxe",
    "name": "car_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "dk5nyu1u80f8dq7",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
