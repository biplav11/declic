/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tjl4qog33nar1of")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cms8r5oo",
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
  const collection = dao.findCollectionByNameOrId("tjl4qog33nar1of")

  // remove
  collection.schema.removeField("cms8r5oo")

  return dao.saveCollection(collection)
})
