/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "hzyr9i9eiqtsetp",
    "created": "2024-08-21 12:16:44.271Z",
    "updated": "2024-08-21 12:16:44.271Z",
    "name": "functional",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "mvcqqvzs",
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
  const collection = dao.findCollectionByNameOrId("hzyr9i9eiqtsetp");

  return dao.deleteCollection(collection);
})
