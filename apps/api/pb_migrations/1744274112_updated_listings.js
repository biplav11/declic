/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm2hnquo4sdou9v")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vewd8tv0",
    "name": "mileage",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm2hnquo4sdou9v")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vewd8tv0",
    "name": "milage",
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

  return dao.saveCollection(collection)
})
