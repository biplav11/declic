/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("dwfct4dvoaflgi0");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "dwfct4dvoaflgi0",
    "created": "2023-10-16 13:46:10.009Z",
    "updated": "2023-10-25 16:46:19.030Z",
    "name": "dealership",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "yc9psrs6",
        "name": "brands",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "9h78a4ythfxor51",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "vbupi78b",
        "name": "user_id",
        "type": "relation",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
