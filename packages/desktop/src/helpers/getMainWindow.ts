import { BrowserWindow } from "electron"

export const getMainWindow = () => {
  if (!mainWindow) {
    // TODO: create custom error for this
    throw new Error("mainWindow is undefined")
  }
  return global.mainWindow as BrowserWindow
}
