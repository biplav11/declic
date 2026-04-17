/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  // remove
  collection.schema.removeField("t5lr1uix")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "t5lr1uix",
    "name": "safety",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 3,
      "values": [
        "abs",
        "curtain airbags",
        "side airbags"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
