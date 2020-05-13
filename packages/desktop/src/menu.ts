import { Menu, MenuItemConstructorOptions, BrowserWindow } from "electron"

function setUpApplicationMenu() {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "New Document",
          click() {
            const [win] = BrowserWindow.getAllWindows()
            // TODO: consider creating a wrapper function that will also 'restore' the window on macOS
            win.webContents.send("new-document", "whoooooooh!")
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
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

export { setUpApplicationMenu }
