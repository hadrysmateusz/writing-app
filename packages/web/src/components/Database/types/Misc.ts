import { RxCollectionCreator, RxDatabase, RxReplicationState } from "rxdb"
import PouchDB from "pouchdb-core"

import { DocumentCollection } from "./Document"
import { GroupCollection } from "./Group"
import { LocalSettingsCollection } from "./LocalSettings"
import { UserdataCollection } from "./Userdata"

export enum CollectionNames {
  documents = "documents",
  groups = "groups",
  userdata = "userdata",
  local_settings = "local_settings",
}

export type MyDatabaseCollections = {
  documents: DocumentCollection
  groups: GroupCollection
  userdata: UserdataCollection
  local_settings: LocalSettingsCollection
}

export interface MyModel extends RxCollectionCreator {
  name: CollectionNames
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
  replicationState: RxReplicationState
}

export type SyncStates = {
  documents: SyncState | null
  groups: SyncState | null
  userdata: SyncState | null
}
