/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm2hnquo4sdou9v")

  // remove
  collection.schema.removeField("amucafro")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm2hnquo4sdou9v")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "amucafro",
    "name": "interior_fabric",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "red",
        "blue",
        "green",
        "other"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
