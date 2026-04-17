/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "tjl4qog33nar1of",
    "created": "2023-10-16 13:49:50.410Z",
    "updated": "2023-10-16 13:49:50.410Z",
    "name": "news_category",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "sm3q3jic",
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
  const collection = dao.findCollectionByNameOrId("tjl4qog33nar1of");

  return dao.deleteCollection(collection);
})
