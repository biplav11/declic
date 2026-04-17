/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkaqzn4gugoayyu")

  collection.name = "body_type"
  collection.indexes = [
    "CREATE INDEX `idx_ldnwBjI` ON `body_type` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkaqzn4gugoayyu")

  collection.name = "Bodytype"
  collection.indexes = [
    "CREATE INDEX `idx_ldnwBjI` ON `Bodytype` (`name`)"
  ]

  return dao.saveCollection(collection)
})
