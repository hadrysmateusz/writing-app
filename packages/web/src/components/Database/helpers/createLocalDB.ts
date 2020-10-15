import { createRxDatabase } from "rxdb"

import { dbNameBase, usernameStartWord } from "../constants"
import { MyDatabase, MyDatabaseCollections } from "../types"
import { encodeLocalDbName } from "./localDbNameEncoding"
/**
 * Generates a name for the local RxDB database. Uses the user's uid to make it unique for every user that logs in on the same machine.
 */
export const generateLocalDbName = (username: string) => {
  return encodeLocalDbName(`${dbNameBase}${usernameStartWord}${username}`)
}

export const createLocalDB = async (username: string): Promise<MyDatabase> => {
  const db = await createRxDatabase<MyDatabaseCollections>({
    name: generateLocalDbName(username),
    adapter: "idb",
    pouchSettings: {
      // This doesn't seem to work as expected and should probably be replaced with manual checks and simply not calling the create functions if they fail
      skip_setup: true,
    },
    // TODO: this flag is set to address the issue with the auth provider remounting the component after logging in to the same account twice but it probably will have some unintended consequences so try to find a better solution
    ignoreDuplicate: true,
  })

  return db
}
