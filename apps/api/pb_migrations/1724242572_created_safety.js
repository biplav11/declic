/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "d8o57uaqwsb1kk1",
    "created": "2024-08-21 12:16:12.401Z",
    "updated": "2024-08-21 12:16:12.401Z",
    "name": "safety",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "yktpzcna",
        "name": "name",
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
  const collection = dao.findCollectionByNameOrId("d8o57uaqwsb1kk1");

  return dao.deleteCollection(collection);
})
