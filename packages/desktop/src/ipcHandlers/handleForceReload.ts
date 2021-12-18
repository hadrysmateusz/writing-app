import { Notification } from "electron"
import { ForceReloadPayload, IpcResponseStatus } from "shared"

import { getMainWindow } from "../helpers"

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
