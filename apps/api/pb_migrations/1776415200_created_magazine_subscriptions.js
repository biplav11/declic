/// <reference path="../pb_data/types.d.ts" />

// magazine_subscriptions — track who receives each magazine issue and how.
// delivery_method drives which of address / email / phone is meaningful:
//   - "delivery"  → requires address
//   - "email"     → requires email
//   - "whatsapp"  → requires phone
// (enforced in the admin UI; schema keeps them individually optional so any
// method can be changed later without violating constraints.)

const ADMIN_RULE = '@request.auth.collectionName = "admins"';

migrate((db) => {
  const collection = new Collection({
    id: "mag_subs_0000001",
    name: "magazine_subscriptions",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "magsub_name",
        name: "name",
        type: "text",
        required: true,
        presentable: true,
        unique: false,
        options: { min: null, max: null, pattern: "" },
      },
      {
        system: false,
        id: "magsub_email",
        name: "email",
        type: "email",
        required: false,
        presentable: false,
        unique: false,
        options: { exceptDomains: null, onlyDomains: null },
      },
      {
        system: false,
        id: "magsub_phone",
        name: "phone",
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: { min: null, max: null, pattern: "" },
      },
      {
        system: false,
        id: "magsub_method",
        name: "delivery_method",
        type: "select",
        required: true,
        presentable: false,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["delivery", "email", "whatsapp"],
        },
      },
      {
        system: false,
        id: "magsub_address",
        name: "address",
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: { min: null, max: null, pattern: "" },
      },
      {
        system: false,
        id: "magsub_city",
        name: "city",
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: { min: null, max: null, pattern: "" },
      },
      {
        system: false,
        id: "magsub_postal",
        name: "postal_code",
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: { min: null, max: null, pattern: "" },
      },
      {
        system: false,
        id: "magsub_country",
        name: "country",
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: { min: null, max: null, pattern: "" },
      },
      {
        system: false,
        id: "magsub_magazine",
        name: "magazine",
        type: "relation",
        required: true,
        presentable: false,
        unique: false,
        options: {
          collectionId: "jwxyo3d9rg7ubyp",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: null,
        },
      },
      {
        system: false,
        id: "magsub_user",
        name: "user",
        type: "relation",
        required: false,
        presentable: false,
        unique: false,
        options: {
          collectionId: "_pb_users_auth_",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: null,
        },
      },
      {
        system: false,
        id: "magsub_status",
        name: "status",
        type: "select",
        required: true,
        presentable: false,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["active", "paused", "cancelled", "expired"],
        },
      },
      {
        system: false,
        id: "magsub_start",
        name: "start_date",
        type: "date",
        required: false,
        presentable: false,
        unique: false,
        options: { min: "", max: "" },
      },
      {
        system: false,
        id: "magsub_end",
        name: "end_date",
        type: "date",
        required: false,
        presentable: false,
        unique: false,
        options: { min: "", max: "" },
      },
      {
        system: false,
        id: "magsub_notes",
        name: "notes",
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: { min: null, max: null, pattern: "" },
      },
    ],
    indexes: [
      "CREATE INDEX idx_magsub_magazine ON magazine_subscriptions (magazine)",
      "CREATE INDEX idx_magsub_status ON magazine_subscriptions (status)",
      "CREATE INDEX idx_magsub_method ON magazine_subscriptions (delivery_method)",
    ],
    listRule: ADMIN_RULE,
    viewRule: ADMIN_RULE,
    createRule: ADMIN_RULE,
    updateRule: ADMIN_RULE,
    deleteRule: ADMIN_RULE,
    options: {},
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("magazine_subscriptions");
  return dao.deleteCollection(collection);
});
