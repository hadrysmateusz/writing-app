import { Menu, MenuItemConstructorOptions, BrowserWindow } from "electron"

function setUpApplicationMenu() {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "New Cloud Document",
          click() {
            const [win] = BrowserWindow.getAllWindows()
            // TODO: consider creating a wrapper function that will also 'restore' the window on macOS
            // TODO: move the message name to a shared constants file
            win.webContents.send("new-cloud-document", "whoooooooh!")
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
    {
      label: "View",
      role: "viewMenu",
    },
    {
      label: "DevTools",
      click() {
        const [win] = BrowserWindow.getAllWindows()
        win.webContents.openDevTools()
      },
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

export { setUpApplicationMenu }
