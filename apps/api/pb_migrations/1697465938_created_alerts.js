/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "do488h1f4pfb0au",
    "created": "2023-10-16 14:18:58.395Z",
    "updated": "2023-10-16 14:18:58.395Z",
    "name": "alerts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "uxuoresy",
        "name": "model",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "v2bd2vp30auugww",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
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
  const collection = dao.findCollectionByNameOrId("do488h1f4pfb0au");

  return dao.deleteCollection(collection);
})
