import { RxDatabase } from "rxdb"
import { DocumentCollection } from "./Document"
import { GroupCollection } from "./Group"
import { LocalSettingsCollection } from "./LocalSettings"
import { UserdataCollection } from "./Userdata"

export type MyDatabaseCollections = {
  documents: DocumentCollection
  groups: GroupCollection
  userdata: UserdataCollection
  local_settings: LocalSettingsCollection
}

export enum CollectionNames {
  documents = "documents",
  groups = "groups",
  userdata = "userdata",
  local_settings = "local_settings",
}

export type MyDatabase = RxDatabase<MyDatabaseCollections>
