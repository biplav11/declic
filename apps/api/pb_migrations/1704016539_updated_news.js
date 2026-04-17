/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("36d533ws4knvy9l")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "izhxl5bg",
    "name": "slug",
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
  const collection = dao.findCollectionByNameOrId("36d533ws4knvy9l")

  // remove
  collection.schema.removeField("izhxl5bg")

  return dao.saveCollection(collection)
})
