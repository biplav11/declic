/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bqk9lwswphh9p69")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lmtd6tpw",
    "name": "position",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bqk9lwswphh9p69")

  // remove
  collection.schema.removeField("lmtd6tpw")

  return dao.saveCollection(collection)
})
