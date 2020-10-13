import { useContext, createContext } from "react"
import { MyDatabase } from "./types"

// TODO: replace with custom createContext
export const DatabaseContext = createContext<MyDatabase | null>(null)
export const useDatabase = () => {
  const database = useContext(DatabaseContext)

  if (database === null) {
    throw new Error("Database is null")
  }

  return database
}
