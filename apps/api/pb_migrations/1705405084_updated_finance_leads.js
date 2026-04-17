/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1oogj3vazkx9yel")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mjeylg6m",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Unfollowed",
        "Followed",
        "Interested",
        "Won",
        "Lost"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1oogj3vazkx9yel")

  // remove
  collection.schema.removeField("mjeylg6m")

  return dao.saveCollection(collection)
})
