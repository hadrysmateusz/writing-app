import { Notification } from "electron"
import { ForceReloadPayload } from "shared/src/ipcMessageTypes"

import { getMainWindow } from "../helpers"
import { IpcResponseStatus } from "../types"

// TODO: add a retry counter to prevent infinite loops on serious issues
export const handleForceReload = async (
  _event,
  _payload: ForceReloadPayload
) => {
  const noti = new Notification({
    title: "Database setup error",
    body: "Attempting force reload",
  })

  noti.show()

  getMainWindow().webContents.reloadIgnoringCache()

  return { status: IpcResponseStatus.SUCCESS, data: {}, error: null }
}
