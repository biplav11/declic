/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jbgwvy5r6nxn1hq")

  // remove
  collection.schema.removeField("rf87ikhh")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jbgwvy5r6nxn1hq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rf87ikhh",
    "name": "test",
    "type": "text",
    "required": true,
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
