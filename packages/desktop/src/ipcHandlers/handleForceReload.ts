import { Notification } from "electron"

import { getMainWindow } from "../helpers"

export const handleForceReload = async (_event, _payload) => {
  const noti = new Notification({
    title: "Database setup error",
    body: "Attempting force reload",
  })

  noti.show()

  getMainWindow().webContents.reloadIgnoringCache()
}
