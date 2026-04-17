/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ztphq4qqxbe326f",
    "created": "2023-12-28 08:03:48.718Z",
    "updated": "2023-12-28 08:03:48.718Z",
    "name": "social_links",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "uux2u13v",
        "name": "platform",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Facebook",
            "Instagram",
            "Twitter",
            "LinkedIn",
            "YouTube"
          ]
        }
      },
      {
        "system": false,
        "id": "o3uu39ts",
        "name": "link",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("ztphq4qqxbe326f");

  return dao.deleteCollection(collection);
})
