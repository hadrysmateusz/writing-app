import { Notification } from "electron"

import { getMainWindow } from "../helpers"

// TODO: add a retry counter to prevent infinite loops on serious issues
export const handleForceReload = async (_event, _payload) => {
  const noti = new Notification({
    title: "Database setup error",
    body: "Attempting force reload",
  })

  noti.show()

  getMainWindow().webContents.reloadIgnoringCache()
}
