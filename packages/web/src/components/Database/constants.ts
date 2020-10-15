import { CollectionNames, SyncStates } from "./types"

export const dbNameBase = "writing_tool" // TODO: change to the name of the app
export const remoteDbDomain = "localhost"
export const remoteDbPort = "5984"
export const usernameStartWord = "__uid__"
export const ROOT_GROUP_ID = "ROOT_GROUP"
export const initialSyncState: SyncStates = {
  [CollectionNames.documents]: null,
  [CollectionNames.groups]: null,
  [CollectionNames.userdata]: null,
}
