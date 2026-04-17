/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  collection.indexes = [
    "CREATE INDEX `idx_dNNWy6V` ON `variants` (`title`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "stdp715u",
    "name": "title",
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
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  collection.indexes = [
    "CREATE INDEX `idx_dNNWy6V` ON `variants` (`name`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "stdp715u",
    "name": "name",
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
})
