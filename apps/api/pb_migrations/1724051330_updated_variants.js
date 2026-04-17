/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  // remove
  collection.schema.removeField("bmvdhdqy")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sq5aq97b",
    "name": "availability",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Available",
        "Unavailable"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4wiluyzo",
    "name": "guarantee",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dbhuzois",
    "name": "seats_count",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vxwnazxb",
    "name": "doors",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bv3m350y",
    "name": "energy",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Disel",
        "Petrol",
        "Electric",
        "Hybrid Gasoline",
        "Plug-in Hybrid Gasoline",
        "Hybrid Diesel",
        "Plug-in Hybrid Diesel"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wtly7dkd",
    "name": "horsepower",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8hbp0l7d",
    "name": "transmission",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Manual",
        "Automatic"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "t5lr1uix",
    "name": "safety",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 3,
      "values": [
        "abs",
        "curtain airbags",
        "side airbags"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8nia1l5x",
    "name": "outdoor_equipment",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 4,
      "values": [
        "rear view camera",
        "led lights",
        "reversing radar",
        "headlight washer"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qwo4cqf6u02rcf6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bmvdhdqy",
    "name": "tech_sheet",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("sq5aq97b")

  // remove
  collection.schema.removeField("4wiluyzo")

  // remove
  collection.schema.removeField("dbhuzois")

  // remove
  collection.schema.removeField("vxwnazxb")

  // remove
  collection.schema.removeField("bv3m350y")

  // remove
  collection.schema.removeField("wtly7dkd")

  // remove
  collection.schema.removeField("8hbp0l7d")

  // remove
  collection.schema.removeField("t5lr1uix")

  // remove
  collection.schema.removeField("8nia1l5x")

  return dao.saveCollection(collection)
})
