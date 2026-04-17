/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ovx4tad5nbfdq1h");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "ovx4tad5nbfdq1h",
    "created": "2023-12-22 15:16:08.534Z",
    "updated": "2023-12-22 15:16:08.534Z",
    "name": "images",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "knuv9pmr",
        "name": "field",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [
            "image/png",
            "image/svg+xml",
            "image/jpeg",
            "image/webp",
            "image/gif",
            "image/bmp"
          ],
          "thumbs": [],
          "protected": false
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
})
