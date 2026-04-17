/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ainp3ivfhdvm9qv",
    "created": "2024-08-21 12:14:58.275Z",
    "updated": "2024-08-21 12:14:58.275Z",
    "name": "outdoor",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "yzifndgl",
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
  const collection = dao.findCollectionByNameOrId("ainp3ivfhdvm9qv");

  return dao.deleteCollection(collection);
})
