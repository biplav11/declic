/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkaqzn4gugoayyu")

  collection.name = "body_types"
  collection.indexes = [
    "CREATE INDEX `idx_ldnwBjI` ON `body_types` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkaqzn4gugoayyu")

  collection.name = "body_type"
  collection.indexes = [
    "CREATE INDEX `idx_ldnwBjI` ON `body_type` (`name`)"
  ]

  return dao.saveCollection(collection)
})
