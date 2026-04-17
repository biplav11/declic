/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "bqk9lwswphh9p69",
    "created": "2023-10-20 19:57:19.016Z",
    "updated": "2023-10-20 19:57:19.016Z",
    "name": "sliders",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "j2z9guof",
        "name": "image",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "n4diltjk",
        "name": "title",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "hutsspdz",
        "name": "subtitle",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "tkrrgyho",
        "name": "field",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Top Left",
            "Top Center",
            "Top Right",
            "Middle Left",
            "Center",
            "Middle Right",
            "BottomLeft",
            "Bottom Center",
            "Bottom Right"
          ]
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("bqk9lwswphh9p69");

  return dao.deleteCollection(collection);
})
