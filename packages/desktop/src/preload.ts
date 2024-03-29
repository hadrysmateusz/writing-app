import { contextBridge, ipcRenderer } from "electron"

// we deliberately strip the event on every method as it includes the sender

contextBridge.exposeInMainWorld("electron", {
  subscribe: (channel, listener) => {
    // // whitelisted channels
    // let validChannels: string[] = []

    // if (!validChannels.includes(channel)) {
    //   throw new Error("THIS CHANNEL HASN'T BEEN WHITELISTED")
    // }

    const subscription = (_event, ...args) => listener(...args)

    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
  invoke: (channel, ...args) => {
    // // whitelisted channels
    // let validChannels: string[] = []

    // if (!validChannels.includes(channel)) {
    //   throw new Error("THIS CHANNEL HASN'T BEEN WHITELISTED")
    // }

    return ipcRenderer.invoke(channel, ...args)
  },
  send: (channel, ...args) => {
    // // whitelisted channels
    // let validChannels: string[] = []

    // if (!validChannels.includes(channel)) {
    //   throw new Error("THIS CHANNEL HASN'T BEEN WHITELISTED")
    // }

    ipcRenderer.send(channel, ...args)
  },
  sendSync: (channel, ...args) => {
    // // whitelisted channels
    // let validChannels: string[] = []

    // if (!validChannels.includes(channel)) {
    //   throw new Error("THIS CHANNEL HASN'T BEEN WHITELISTED")
    // }

    return ipcRenderer.sendSync(channel, ...args)
  },
  receive: (channel, handler) => {
    // // whitelisted channels
    // let validChannels: string[] = []

    // if (!validChannels.includes(channel)) {
    //   throw new Error("THIS CHANNEL HASN'T BEEN WHITELISTED")
    // }

    ipcRenderer.on(channel, (_event, ...args) => handler(...args))
  },
  removeListener: (channel, handler) => {
    ipcRenderer.removeListener(channel, handler)
  },
})

export {}
