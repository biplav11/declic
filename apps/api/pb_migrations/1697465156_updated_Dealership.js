/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dwfct4dvoaflgi0")

  collection.name = "dealership"
  collection.indexes = [
    "CREATE INDEX `idx_oM70g4x` ON `dealership` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dwfct4dvoaflgi0")

  collection.name = "Dealership"
  collection.indexes = [
    "CREATE INDEX `idx_oM70g4x` ON `Dealership` (`name`)"
  ]

  return dao.saveCollection(collection)
})
