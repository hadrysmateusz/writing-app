// Figure out a way to make this a shared enum
type ElectronIpcChannel = "NEW_CLOUD_DOCUMENT" | "READ_FILE" | "SAVE_FILE"

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
