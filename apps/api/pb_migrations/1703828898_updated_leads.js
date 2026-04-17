/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jbgwvy5r6nxn1hq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wb3e9yqp",
    "name": "m",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jbgwvy5r6nxn1hq")

  // remove
  collection.schema.removeField("wb3e9yqp")

  return dao.saveCollection(collection)
})
