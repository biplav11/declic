/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "p6o4xj0uc6lf5ri",
    "created": "2024-08-21 12:16:23.860Z",
    "updated": "2024-08-21 12:16:23.860Z",
    "name": "interior",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "rlu6a1wu",
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
  const collection = dao.findCollectionByNameOrId("p6o4xj0uc6lf5ri");

  return dao.deleteCollection(collection);
})
