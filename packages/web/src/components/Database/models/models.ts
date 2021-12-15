import { defaultLocalSettings } from "../../LocalSettings"

import { CollectionNames } from "../types"

import { documentSchema, DocumentDoc, DocumentCollection } from "./Document"
import { groupSchema } from "./Group"
import { localSettingsSchema, LocalSettingsDoc } from "./LocalSettings"
import { tagSchema } from "./Tag"
import { userdataSchema } from "./Userdata"

// TODO: skip_setup doesn't seem to work as expected and should probably be replaced with manual checks and simply not calling the create functions if they fail
export const models = {
  [CollectionNames.documents]: {
    schema: documentSchema,
    statics: {
      findNotRemoved(this: DocumentCollection) {
        return this.find().where("isDeleted").eq(false)
      },
      findOneNotRemoved(this: DocumentCollection) {
        return this.findOne().where("isDeleted").eq(false)
      },
    },
    methods: {
      softRemove(this: DocumentDoc) {
        return this.update({
          $set: {
            isDeleted: true,
          },
        })
      },
    },
    // TODO: remove migration strategies 1 and 2 when I clear the database. They are temporary
    migrationStrategies: {
      1: function (oldDoc: DocumentDoc) {
        // TODO: improve the way titleSlugs are created with some additional encoding/sanitization
        oldDoc.titleSlug = oldDoc.title.toLowerCase() + " " + Date.now()
        console.log("title:", oldDoc.title, "titleSlug:", oldDoc.titleSlug)
        return oldDoc
      },
      2: function (oldDoc: DocumentDoc) {
        // TODO: improve the way titleSlugs are created with some additional encoding/sanitization
        oldDoc.titleSlug = oldDoc.title.toLowerCase() + " " + Date.now()
        console.log("title:", oldDoc.title, "titleSlug:", oldDoc.titleSlug)
        return oldDoc
      },
      3: function (oldDoc: DocumentDoc) {
        // TODO: improve the way titleSlugs are created with some additional encoding/sanitization
        oldDoc.titleSlug = oldDoc.title.toLowerCase() + " " + Date.now()
        console.log("title:", oldDoc.title, "titleSlug:", oldDoc.titleSlug)
        return oldDoc
      },
      4: function (oldDoc: DocumentDoc) {
        // TODO: improve the way titleSlugs are created with some additional encoding/sanitization
        oldDoc.titleSlug = (
          oldDoc.title.toLowerCase() +
          " " +
          Date.now()
        ).trim()
        console.log("title:", oldDoc.title, "titleSlug:", oldDoc.titleSlug)
        return oldDoc
      },
      5: function (oldDoc: DocumentDoc) {
        // TODO: improve the way titleSlugs are created with some additional encoding/sanitization
        oldDoc.titleSlug = `${
          oldDoc.title.trim() === ""
            ? "untitled"
            : oldDoc.title.trim().toLowerCase()
        } ${Date.now()}`.trim()
        console.log("title:", oldDoc.title, "titleSlug:", oldDoc.titleSlug)
        return oldDoc
      },
      6: function (oldDoc: DocumentDoc) {
        oldDoc.tags = []
        return oldDoc
      },
    },
    // pouchSettings: {
    //   skip_setup: true,
    // },
    options: {
      sync: true,
    },
  },
  [CollectionNames.groups]: {
    schema: groupSchema,
    statics: {},
    methods: {},
    migrationStrategies: {},
    // pouchSettings: {
    //   skip_setup: true,
    // },
    options: {
      sync: true,
    },
  },
  [CollectionNames.tags]: {
    schema: tagSchema,
    statics: {},
    methods: {},
    migrationStrategies: {},
    // pouchSettings: {
    //   skip_setup: true,
    // },
    options: {
      sync: true,
    },
  },
  [CollectionNames.userdata]: {
    schema: userdataSchema,
    statics: {},
    methods: {},
    migrationStrategies: {},
    // pouchSettings: {
    //   skip_setup: true,
    // },
    options: {
      sync: true,
    },
  },
  [CollectionNames.local_settings]: {
    schema: localSettingsSchema,
    statics: {},
    methods: {},
    migrationStrategies: {
      1: function (oldDoc: LocalSettingsDoc) {
        // TODO: improve the way titleSlugs are created with some additional encoding/sanitization
        oldDoc.sidebars = defaultLocalSettings.sidebars
        return oldDoc
      },
      2: function (oldDoc: LocalSettingsDoc) {
        return {
          ...defaultLocalSettings,
          userId: oldDoc.userId,
        }
      },
      3: function (oldDoc: LocalSettingsDoc) {
        return {
          ...defaultLocalSettings,
          userId: oldDoc.userId,
        }
      },
      4: function (oldDoc: LocalSettingsDoc) {
        return {
          ...oldDoc,
          localDocPaths: [],
        }
      },
      5: function (oldDoc: LocalSettingsDoc) {
        return {
          ...oldDoc,
          expandedKeys: {
            cloud: oldDoc.expandedKeys,
            local: [],
          },
        }
      },
      6: function (oldDoc: LocalSettingsDoc) {
        return {
          ...oldDoc,
          documentsListDisplayType:
            defaultLocalSettings.documentsListDisplayType,
        }
      },
    },
    // pouchSettings: {
    //   skip_setup: true,
    // },
    options: {
      sync: false,
    },
  },
}

export default models
