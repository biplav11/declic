/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tjl4qog33nar1of")

  collection.name = "news_categories"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tjl4qog33nar1of")

  collection.name = "news_category"

  return dao.saveCollection(collection)
})
