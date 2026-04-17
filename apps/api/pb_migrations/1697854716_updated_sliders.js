/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bqk9lwswphh9p69")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fw8uoo17",
    "name": "link",
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
  const collection = dao.findCollectionByNameOrId("bqk9lwswphh9p69")

  // remove
  collection.schema.removeField("fw8uoo17")

  return dao.saveCollection(collection)
})
