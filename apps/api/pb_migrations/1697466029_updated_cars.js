/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dk5nyu1u80f8dq7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zehdq8qj",
    "name": "overview",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ofse2n02",
    "name": "tech_specs",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ncahooom",
    "name": "equipments",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dk5nyu1u80f8dq7")

  // remove
  collection.schema.removeField("zehdq8qj")

  // remove
  collection.schema.removeField("ofse2n02")

  // remove
  collection.schema.removeField("ncahooom")

  return dao.saveCollection(collection)
})
