/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bqk9lwswphh9p69")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tkrrgyho",
    "name": "alignment",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Top Left",
        "Top Center",
        "Top Right",
        "Middle Left",
        "Center",
        "Middle Right",
        "Bottom Left",
        "Bottom Center",
        "Bottom Right"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bqk9lwswphh9p69")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tkrrgyho",
    "name": "alignment",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Top Left",
        "Top Center",
        "Top Right",
        "Middle Left",
        "Center",
        "Middle Right",
        "BottomLeft",
        "Bottom Center",
        "Bottom Right"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
