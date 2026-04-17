/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  collection.name = "variants"
  collection.indexes = [
    "CREATE INDEX `idx_dNNWy6V` ON `variants` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  collection.name = "Variants"
  collection.indexes = [
    "CREATE INDEX `idx_dNNWy6V` ON `Variants` (`name`)"
  ]

  return dao.saveCollection(collection)
})
