import { RxDatabase } from "rxdb"
import { DocumentCollection } from "./Document"
import { GroupCollection } from "./Group"
import { UserdataCollection } from "./Userdata"

export type MyDatabaseCollections = {
  documents: DocumentCollection
  groups: GroupCollection
  userdata: UserdataCollection
}

export type MyDatabase = RxDatabase<MyDatabaseCollections>
