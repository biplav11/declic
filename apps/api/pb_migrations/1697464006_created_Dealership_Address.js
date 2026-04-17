/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "rxoy9ubcajp5b6o",
    "created": "2023-10-16 13:46:46.518Z",
    "updated": "2023-10-16 13:46:46.518Z",
    "name": "Dealership_Address",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "b0eb9wet",
        "name": "address",
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
        "id": "uoeh0qrx",
        "name": "dealership_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "dwfct4dvoaflgi0",
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
  const collection = dao.findCollectionByNameOrId("rxoy9ubcajp5b6o");

  return dao.deleteCollection(collection);
})
