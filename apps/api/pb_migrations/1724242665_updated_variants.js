/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  // remove
  collection.schema.removeField("qnvzafbp")

  // remove
  collection.schema.removeField("mhseavbr")

  // remove
  collection.schema.removeField("t54b49my")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ufjasvlm",
    "name": "interior",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "p6o4xj0uc6lf5ri",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vrtkjmtq",
    "name": "safety",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "d8o57uaqwsb1kk1",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qcl66nk6",
    "name": "functional",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "hzyr9i9eiqtsetp",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qnvzafbp",
    "name": "safety",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mhseavbr",
    "name": "interior",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "t54b49my",
    "name": "functional",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("ufjasvlm")

  // remove
  collection.schema.removeField("vrtkjmtq")

  // remove
  collection.schema.removeField("qcl66nk6")

  return dao.saveCollection(collection)
})
