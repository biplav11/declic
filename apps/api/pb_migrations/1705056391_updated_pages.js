/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3m2z4jabx3208q3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "x21dgzum",
    "name": "slug",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3m2z4jabx3208q3")

  // remove
  collection.schema.removeField("x21dgzum")

  return dao.saveCollection(collection)
})
