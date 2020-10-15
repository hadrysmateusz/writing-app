import { MyDatabase, SyncStates } from "./types"

import { createContext } from "../../utils"

export const [useDatabase, _DatabaseProvider, DatabaseContext] = createContext<
  MyDatabase
>()

export const [
  useSyncState,
  _SyncStateProvider,
  SyncStateContext,
] = createContext<SyncStates>()
