/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ei921aek4r7bit4",
    "created": "2023-10-20 20:33:42.332Z",
    "updated": "2023-10-20 20:33:42.332Z",
    "name": "site_settings",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fysg1g2s",
        "name": "field",
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
        "id": "2zbl8oi2",
        "name": "value",
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
  const collection = dao.findCollectionByNameOrId("ei921aek4r7bit4");

  return dao.deleteCollection(collection);
})
