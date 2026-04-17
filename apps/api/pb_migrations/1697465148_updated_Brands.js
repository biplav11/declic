/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h78a4ythfxor51")

  collection.name = "brands"
  collection.indexes = [
    "CREATE INDEX `idx_vLfJpv9` ON `brands` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h78a4ythfxor51")

  collection.name = "Brands"
  collection.indexes = [
    "CREATE INDEX `idx_vLfJpv9` ON `Brands` (`name`)"
  ]

  return dao.saveCollection(collection)
})
