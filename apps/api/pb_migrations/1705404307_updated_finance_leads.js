/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1oogj3vazkx9yel")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jtgpirc7",
    "name": "address",
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
  const collection = dao.findCollectionByNameOrId("1oogj3vazkx9yel")

  // remove
  collection.schema.removeField("jtgpirc7")

  return dao.saveCollection(collection)
})
