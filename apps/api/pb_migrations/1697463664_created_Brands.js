/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "9h78a4ythfxor51",
    "created": "2023-10-16 13:41:04.144Z",
    "updated": "2023-10-16 13:41:04.144Z",
    "name": "Brands",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ep9poca0",
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
      },
      {
        "system": false,
        "id": "aruqeaq1",
        "name": "image",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [],
          "thumbs": [],
          "protected": false
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_vLfJpv9` ON `Brands` (`name`)"
    ],
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
  const collection = dao.findCollectionByNameOrId("9h78a4ythfxor51");

  return dao.deleteCollection(collection);
})
