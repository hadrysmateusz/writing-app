import { MyDatabase, SyncStates } from "./types"

import { createContext } from "../../utils"

export const [DatabaseContext, useDatabase] = createContext<MyDatabase>()

export const [SyncStateContext, useSyncState] = createContext<SyncStates>()
