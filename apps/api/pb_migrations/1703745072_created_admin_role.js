/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "2i4esr7h964lm43",
    "created": "2023-12-28 06:31:12.504Z",
    "updated": "2023-12-28 06:31:12.504Z",
    "name": "admin_role",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "qetttwyv",
        "name": "admin_id",
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
        "id": "cysz0umh",
        "name": "role",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "editor",
            "super_admin"
          ]
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
  const collection = dao.findCollectionByNameOrId("2i4esr7h964lm43");

  return dao.deleteCollection(collection);
})
