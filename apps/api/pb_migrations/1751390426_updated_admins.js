/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9ci3awohmfsmht8")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nwqweqlk",
    "name": "role",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "super",
        "editor"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9ci3awohmfsmht8")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nwqweqlk",
    "name": "role",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "super",
        "editor"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
