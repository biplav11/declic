/// <reference path="../pb_data/types.d.ts" />

// Repurpose the existing `magazine` collection (id `jwxyo3d9rg7ubyp`) into the
// digital-magazine-copy record. Drops the legacy `field` (date) and adds the
// 9-field set we agreed: title (kept), slug, file, cover, description, tags,
// meta_data, published_at, published.
//
// Idempotent — only adds fields that aren't already there, so a repeat
// migrate-up is safe.

const COLLECTION = "jwxyo3d9rg7ubyp";

migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId(COLLECTION);

  const has = (name) => collection.schema.getFieldByName(name);

  // Drop the obsolete `field` (date).
  if (has("field")) collection.schema.removeField("7ffjnhwy");

  // Make title required (it was optional before).
  const title = has("title");
  if (title) title.required = true;

  if (!has("slug")) {
    collection.schema.addField(new SchemaField({
      system: false,
      id: "mag_slug",
      name: "slug",
      type: "text",
      required: true,
      presentable: true,
      unique: true,
      options: { min: null, max: null, pattern: "" },
    }));
  }

  if (!has("file")) {
    collection.schema.addField(new SchemaField({
      system: false,
      id: "mag_file",
      name: "file",
      type: "file",
      required: false,
      presentable: false,
      unique: false,
      options: {
        maxSelect: 1,
        maxSize: 100 * 1024 * 1024,
        mimeTypes: ["application/pdf", "application/epub+zip"],
        thumbs: [],
        protected: false,
      },
    }));
  }

  if (!has("cover")) {
    collection.schema.addField(new SchemaField({
      system: false,
      id: "mag_cover",
      name: "cover",
      type: "file",
      required: false,
      presentable: false,
      unique: false,
      options: {
        maxSelect: 1,
        maxSize: 5 * 1024 * 1024,
        mimeTypes: ["image/jpeg", "image/png", "image/webp"],
        thumbs: ["400x500", "200x250"],
        protected: false,
      },
    }));
  }

  if (!has("description")) {
    collection.schema.addField(new SchemaField({
      system: false,
      id: "mag_desc",
      name: "description",
      type: "editor",
      required: false,
      presentable: false,
      unique: false,
      options: { convertUrls: false },
    }));
  }

  if (!has("tags")) {
    collection.schema.addField(new SchemaField({
      system: false,
      id: "mag_tags",
      name: "tags",
      type: "json",
      required: false,
      presentable: false,
      unique: false,
      options: { maxSize: 2000 },
    }));
  }

  if (!has("meta_data")) {
    collection.schema.addField(new SchemaField({
      system: false,
      id: "mag_meta",
      name: "meta_data",
      type: "json",
      required: false,
      presentable: false,
      unique: false,
      options: { maxSize: 5000 },
    }));
  }

  if (!has("published_at")) {
    collection.schema.addField(new SchemaField({
      system: false,
      id: "mag_pubat",
      name: "published_at",
      type: "date",
      required: false,
      presentable: false,
      unique: false,
      options: { min: "", max: "" },
    }));
  }

  if (!has("published")) {
    collection.schema.addField(new SchemaField({
      system: false,
      id: "mag_pub",
      name: "published",
      type: "bool",
      required: false,
      presentable: false,
      unique: false,
      options: {},
    }));
  }

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId(COLLECTION);
  for (const id of [
    "mag_slug", "mag_file", "mag_cover", "mag_desc", "mag_tags",
    "mag_meta", "mag_pubat", "mag_pub",
  ]) {
    if (collection.schema.getFieldById(id)) collection.schema.removeField(id);
  }
  return dao.saveCollection(collection);
});
