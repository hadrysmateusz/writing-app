import { IpcChannels, IpcResponseTypes } from "shared"

declare global {
  interface Window {
    electron: {
      subscribe: (
        channel: IpcChannels,
        listener: (...args: any[]) => any
      ) => () => void

      invoke: <Channel extends IpcChannels>(
        channel: Channel,
        payload: IpcPayloadTypes[Channel]
      ) => Promise<IpcResponseTypes[Channel]>

      send: (channel: IpcChannels, ...args: any[]) => void

      sendSync: (channel, ...args) => any

      receive: (channel: IpcChannels, handler: (...args: any[]) => void) => void

      removeListener: (
        channel: IpcChannels,
        handler: (...args: any[]) => void
      ) => void
    }
  }
}

// export type ElectronIpcChannel = IpcChannelFromRenderer | IpcChannelFromMain
// type IpcChannelFromRenderer =
//   | "NEW_CLOUD_DOCUMENT"
//   | "IMPORT_FILE"
//   | "EXPORT_FILE"
//   | "ADD_PATH"
//   | "GET_PATH_CONTENTS"
//   | "VALIDATE_PATHS"
//   | "OPEN_FILE"
//   | "SAVE_FILE"
//   | "CREATE_FILE"
//   | "WATCH_DIR"
//   | "STOP_WATCH_DIR"
//   | "FORCE_RELOAD"
//   | "VIEW_IN_EXPLORER"
//   | "DELETE_FILE"
//   | "CREATE_DIR"
//   | "DELETE_DIR"
// type IpcChannelFromMain = "WATCH_DIR:RES"
