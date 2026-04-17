/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jbgwvy5r6nxn1hq")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9yz2e3xp",
    "name": "source",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Website",
        "Social Sites",
        "Phone",
        "Referral",
        "Other"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jbgwvy5r6nxn1hq")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9yz2e3xp",
    "name": "source",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Website",
        "Social SItes",
        "Phone",
        "Referral",
        "Other"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
