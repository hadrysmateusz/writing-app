import React, { useState, useContext, createContext, useEffect } from "react"
import { addRxPlugin, createRxDatabase } from "rxdb"
import PouchDbAdapterIdb from "pouchdb-adapter-idb"
import PouchDbAdapterHttp from "pouchdb-adapter-http"
import { documentSchema, groupSchema } from "./Schema"
import { MyDatabaseCollections, MyDatabase, DocumentDoc } from "./types"

addRxPlugin(PouchDbAdapterIdb)
addRxPlugin(PouchDbAdapterHttp) //enable syncing over http

const collections = [
  {
    name: "documents",
    schema: documentSchema,
    sync: true,
    migrationStrategies: {
      // version 0 => 1
      1: (oldDoc: DocumentDoc) => {
        oldDoc.isFavorite = false
        return oldDoc
      },
    },
  },
  {
    name: "groups",
    schema: groupSchema,
    sync: true,
  },
]

const dbName = "writingtooldocumentsdb" // TODO: rename to something more general
const syncURL = "http://" + window.location.hostname + ":10102/"

const DatabaseContext = createContext<MyDatabase | null>(null)

export const useDatabase = () => {
  const database = useContext(DatabaseContext)

  if (database === null) {
    throw new Error("Database is null")
  }

  return database
}

export const DatabaseProvider: React.FC<{}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [database, setDatabase] = useState<MyDatabase | null>(null)

  useEffect(() => {
    const createDatabase = async () => {
      // create database
      console.log("DatabaseService: creating database..")
      const db = await createRxDatabase<MyDatabaseCollections>({
        name: dbName,
        adapter: "idb",
      })
      console.log("DatabaseService: created database")

      // write to window for debugging
      window["db"] = db

      // create collections
      console.log("DatabaseService: creating collections...")
      await Promise.all(collections.map((colData) => db.collection(colData)))
      console.log("DatabaseService: created collections")

      // sync
      console.log("DatabaseService: setting up sync...")
      // TODO: check if sync returns a promise to be resolved
      console.warn("Sync disabled: Check the Database.tsx file")
      // collections
      //   .filter((col) => col.sync)
      //   .map((col) => col.name)
      //   .forEach((colName) =>
      //     db[colName].sync({
      //       remote: syncURL + colName + "/",
      //     })
      //   )
      console.log("DatabaseService: sync set up")

      setDatabase(db) // TODO: check if a ref (or a simple global singleton) wouldn't be more appropriate
      setIsLoading(false)
    }

    createDatabase()
  }, [])

  console.log(isLoading, database)

  // TODO: better loading and error states
  return (
    <>
      {isLoading ? (
        "Loading..."
      ) : database === null ? (
        "Database setup error"
      ) : (
        <DatabaseContext.Provider value={database}>
          {children}
        </DatabaseContext.Provider>
      )}
    </>
  )
}
