import {
  createRxDatabase,
  addRxPlugin,
  RxDatabase,
  RxDocument,
  RxCollection,
  RxJsonSchema,
} from "rxdb"
import PouchDbAdapterIdb from "pouchdb-adapter-idb"
import PouchDbAdapterHttp from "pouchdb-adapter-http"

addRxPlugin(PouchDbAdapterIdb)
addRxPlugin(PouchDbAdapterHttp) //enable syncing over http

export type DocumentDocType = {
  title: string
  content: string
}

export type DocumentDocMethods = {}

export type DocumentDoc = RxDocument<DocumentDocType, DocumentDocMethods>

export type DocumentCollectionMethods = {}

export type DocumentCollection = RxCollection<
  DocumentDocType,
  DocumentDocMethods,
  DocumentCollectionMethods
>

export type MyDatabaseCollections = { documents: DocumentCollection }

export type MyDatabase = RxDatabase<MyDatabaseCollections>

const documentSchema: RxJsonSchema<DocumentDocType> = {
  title: "document schema",
  description: "describes a document",
  version: 0,
  type: "object",
  properties: {
    title: {
      type: "string",
      primary: true,
    },
    content: {
      type: "string",
    },
  },
  required: ["title", "content"],
}

const collections = [
  {
    name: "documents",
    schema: documentSchema,
    sync: true,
  },
]

const syncURL = "http://" + window.location.hostname + ":10102/"
console.log("host: " + syncURL)

let dbPromise: Promise<MyDatabase> | null = null

const _create = async () => {
  console.log("DatabaseService: creating database..")
  const db = await createRxDatabase<MyDatabaseCollections>({
    name: "writingtooldocumentsdb",
    adapter: "idb",
  })
  console.log("DatabaseService: created database")
  window["db"] = db // write to window for debugging

  // show leadership in title
  db.waitForLeadership().then(() => {
    console.log("isLeader now")
    document.title = "♛ " + document.title
  })

  // create collections
  console.log("DatabaseService: create collections")
  await Promise.all(collections.map((colData) => db.collection(colData)))

  // sync
  console.log("DatabaseService: sync")
  collections
    .filter((col) => col.sync)
    .map((col) => col.name)
    .map((colName) =>
      db[colName].sync({
        remote: syncURL + colName + "/",
      })
    )

  return db
}

export const getDatabase = () => {
  if (!dbPromise) dbPromise = _create()
  return dbPromise
}
