/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "jwxyo3d9rg7ubyp",
    "created": "2024-08-19 07:23:44.446Z",
    "updated": "2024-08-19 07:23:44.446Z",
    "name": "magazine",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "p4fclhxz",
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
        "id": "7ffjnhwy",
        "name": "field",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
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
  const collection = dao.findCollectionByNameOrId("jwxyo3d9rg7ubyp");

  return dao.deleteCollection(collection);
})
