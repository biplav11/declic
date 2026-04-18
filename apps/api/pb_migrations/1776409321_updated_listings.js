/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm2hnquo4sdou9v")

  // remove
  collection.schema.removeField("lesuxspo")

  // remove
  collection.schema.removeField("x84bq5ec")

  // remove
  collection.schema.removeField("j9zeefjc")

  // remove
  collection.schema.removeField("mopjhhxj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "90ovmcyz",
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
    "id": "yaapzvfg",
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
    "id": "0ulfl92o",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yf2hweeq",
    "name": "outdoor",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ainp3ivfhdvm9qv",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gm2hnquo4sdou9v")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lesuxspo",
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
    "id": "x84bq5ec",
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
    "id": "j9zeefjc",
    "name": "exterior",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mopjhhxj",
    "name": "functional",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("90ovmcyz")

  // remove
  collection.schema.removeField("yaapzvfg")

  // remove
  collection.schema.removeField("0ulfl92o")

  // remove
  collection.schema.removeField("yf2hweeq")

  return dao.saveCollection(collection)
})
