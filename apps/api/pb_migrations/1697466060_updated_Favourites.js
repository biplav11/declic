/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("duvnsak1og9vfkj")

  collection.name = "favourites"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("duvnsak1og9vfkj")

  collection.name = "Favourites"

  return dao.saveCollection(collection)
})
