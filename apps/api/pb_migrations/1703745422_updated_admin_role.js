/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2i4esr7h964lm43")

  collection.name = "editors"

  // remove
  collection.schema.removeField("cysz0umh")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2i4esr7h964lm43")

  collection.name = "admin_role"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cysz0umh",
    "name": "role",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "editor",
        "super_admin"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
