import { IpcRendererEvent } from "electron"
import isElectron from "is-electron"

/**
 * Sets up ipc listener
 *
 * @returns a function that removes the listener
 */
export const listenForIpcEvent = (
  topic: string,
  handler: (_event: IpcRendererEvent, args: any[]) => void
) => {
  if (isElectron()) {
    window.ipcRenderer.on(topic, handler)
    return () => {
      window.ipcRenderer.removeListener(topic, handler)
    }
  }
  return () => {}
}
