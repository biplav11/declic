/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jbgwvy5r6nxn1hq")

  // remove
  collection.schema.removeField("w5fm1ppr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1chqygwk",
    "name": "variant_id",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jbgwvy5r6nxn1hq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "w5fm1ppr",
    "name": "listing_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "gm2hnquo4sdou9v",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("1chqygwk")

  return dao.saveCollection(collection)
})
