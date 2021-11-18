import {
  RxCollectionCreator,
  RxCouchDBReplicationState,
  RxDatabase,
} from "rxdb"
import PouchDB from "pouchdb-core"

import { DocumentCollection } from "./Document"
import { GroupCollection } from "./Group"
import { LocalSettingsCollection } from "./LocalSettings"
import { UserdataCollection } from "./Userdata"
import { TagCollection } from "./Tag"

export enum CollectionNames {
  documents = "documents",
  groups = "groups",
  userdata = "userdata",
  local_settings = "local_settings",
  tags = "tags",
}

export type MyDatabaseCollections = {
  documents: DocumentCollection
  groups: GroupCollection
  userdata: UserdataCollection
  local_settings: LocalSettingsCollection
  tags: TagCollection
}

export interface MyModel extends RxCollectionCreator {
  /**
   * Custom properties
   */
  options: {
    /**
     * Indicates if the collection should be automatically synced with remote db
     */
    sync: boolean
  }
}

export type MyDatabase = RxDatabase<MyDatabaseCollections>

export type SyncState = {
  remoteDB: PouchDB.Database<{}>
  replicationState: RxCouchDBReplicationState
}

export type SyncStates = {
  documents: SyncState | null
  groups: SyncState | null
  userdata: SyncState | null
}
