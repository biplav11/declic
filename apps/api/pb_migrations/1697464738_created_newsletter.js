/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "zp9lg0b203gwt27",
    "created": "2023-10-16 13:58:58.780Z",
    "updated": "2023-10-16 13:58:58.780Z",
    "name": "newsletter",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "d9wqi1di",
        "name": "email",
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
  const collection = dao.findCollectionByNameOrId("zp9lg0b203gwt27");

  return dao.deleteCollection(collection);
})
