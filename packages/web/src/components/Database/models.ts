import { CollectionNames, DocumentCollection, DocumentDoc } from "./types"
import {
  documentSchema,
  groupSchema,
  localSettingsSchema,
  userdataSchema,
} from "./schemas"

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
    migrationStrategies: {},
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
    migrationStrategies: {},
    // pouchSettings: {
    //   skip_setup: true,
    // },
    options: {
      sync: false,
    },
  },
}

export default models
