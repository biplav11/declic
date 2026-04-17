/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("v2bd2vp30auugww")

  collection.name = "models"
  collection.indexes = [
    "CREATE INDEX `idx_I3oj68q` ON `models` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("v2bd2vp30auugww")

  collection.name = "model"
  collection.indexes = [
    "CREATE INDEX `idx_I3oj68q` ON `model` (`name`)"
  ]

  return dao.saveCollection(collection)
})
