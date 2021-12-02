// Figure out a way to make this a shared enum
export type ElectronIpcChannel = IpcChannelFromRenderer | IpcChannelFromMain
type IpcChannelFromRenderer =
  | "NEW_CLOUD_DOCUMENT"
  | "READ_FILE"
  | "SAVE_FILE"
  | "ADD_PATH"
  | "GET_FILES_AT_PATH"
  | "VALIDATE_PATHS"
  | "OPEN_FILE"
  | "WRITE_FILE"
  | "CREATE_FILE"
  | "WATCH_DIR"
  | "STOP_WATCH_DIR"
  | "FORCE_RELOAD"
type IpcChannelFromMain = "WATCH_DIR:RES"

declare global {
  interface Window {
    electron: {
      subscribe: (
        channel: ElectronIpcChannel,
        listener: (...args: any[]) => any
      ) => () => void
      invoke: (channel: ElectronIpcChannel, ...args: any[]) => Promise<any>
      send: (channel: ElectronIpcChannel, ...args: any[]) => void
      sendSync: (channel, ...args) => any
      receive: (
        channel: ElectronIpcChannel,
        handler: (...args: any[]) => void
      ) => void
      removeListener: (
        channel: ElectronIpcChannel,
        handler: (...args: any[]) => void
      ) => void
    }
  }
}

export { ElectronIpcChannel }
