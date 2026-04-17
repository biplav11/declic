/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rxoy9ubcajp5b6o")

  collection.name = "dealership_address"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rxoy9ubcajp5b6o")

  collection.name = "Dealership_Address"

  return dao.saveCollection(collection)
})
