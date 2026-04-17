/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm2hnquo4sdou9v")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8hwo81ki",
    "name": "user",
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
  const collection = dao.findCollectionByNameOrId("gm2hnquo4sdou9v")

  // remove
  collection.schema.removeField("8hwo81ki")

  return dao.saveCollection(collection)
})
