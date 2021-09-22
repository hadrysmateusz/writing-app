// type ElectronIpcChannel = "new-cloud-document" | "read-file" | "save-file"

enum ElectronIpcChannel {
  NEW_CLOUD_DOCUMENT = "NEW_CLOUD_DOCUMENT",
  READ_FILE = "READ_FILE",
  SAVE_FILE = "SAVE_FILE",
}

declare global {
  interface Window {
    electron: {
      subscribe: (
        channel: ElectronIpcChannel,
        listener: (...args: any[]) => any
      ) => () => void
      invoke: (channel: ElectronIpcChannel, ...args: any[]) => Promise<any>
      send: (channel: ElectronIpcChannel, ...args: any[]) => void
      receive: (
        channel: ElectronIpcChannel,
        handler: (...args: any[]) => void
      ) => void
    }
  }
}

export { ElectronIpcChannel }
