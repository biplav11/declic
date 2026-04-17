/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bv3m350y",
    "name": "energy",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Diesel",
        "Petrol",
        "Electric",
        "Hybrid Gasoline",
        "Plug-in Hybrid Gasoline",
        "Hybrid Diesel",
        "Plug-in Hybrid Diesel"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bv3m350y",
    "name": "energy",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Disel",
        "Petrol",
        "Electric",
        "Hybrid Gasoline",
        "Plug-in Hybrid Gasoline",
        "Hybrid Diesel",
        "Plug-in Hybrid Diesel"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
