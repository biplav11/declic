/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zp9lg0b203gwt27")

  collection.name = "newsletters"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zp9lg0b203gwt27")

  collection.name = "newsletter"

  return dao.saveCollection(collection)
})
