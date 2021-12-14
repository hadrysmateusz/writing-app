import {
  RxCollectionCreator,
  RxCouchDBReplicationState,
  RxDatabase,
} from "rxdb"
import PouchDB from "pouchdb-core"

import { DocumentCollection } from "./models/Document"
import { GroupCollection } from "./models/Group"
import { LocalSettingsCollection } from "./models/LocalSettings"
import { UserdataCollection } from "./models/Userdata"
import { TagCollection } from "./models/Tag"

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

/**
 * The generic type has to be an RxDB Document
 *
 * Generics:
 * - D RxDB Document
 * - T RxDB DocType
 */
export type UpdateQueryConstructor<D, T> = (original: D) => Partial<T>

/**
 * Can be either:
 * - A set of values to be changed
 * - A function that takes the original document as a parameter and returnes an object with new values
 *
 * Generics:
 * - D RxDB Document
 * - T RxDB DocType
 */
export type Updater<D, T> = UpdateQueryConstructor<D, T> | Partial<T>
