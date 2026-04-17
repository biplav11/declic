/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rxoy9ubcajp5b6o")

  // remove
  collection.schema.removeField("uoeh0qrx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "g23o7aai",
    "name": "user_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rxoy9ubcajp5b6o")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uoeh0qrx",
    "name": "dealership_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "dwfct4dvoaflgi0",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("g23o7aai")

  return dao.saveCollection(collection)
})
