/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ei921aek4r7bit4")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_vlWRjs1` ON `site_settings` (`key`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ei921aek4r7bit4")

  collection.indexes = []

  return dao.saveCollection(collection)
})
