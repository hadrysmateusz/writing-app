import { dialog, shell } from "electron"
import fs from "fs-extra"
import path from "path"
import os from "os"

import { FileFormats, DialogStatus } from "../types"
import { APP_NAME, filters } from "../constants"

export const handleExportFile = async (
  _event,
  payload: {
    content: string
    format: FileFormats
    name: string | undefined
  }
) => {
  try {
    const { content, format, name } = payload

    // TODO: better default path
    // TODO: save the last used path for later
    // TODO: consider making the path configurable in settings

    let defaultPath = path.join(os.homedir(), APP_NAME)
    const filter = filters[format]

    await fs.ensureDir(defaultPath)

    if (typeof name === "string" && name.trim() !== "") {
      defaultPath = path.join(defaultPath, `${name}.${format}`)
    }

    // TODO: investigate if I should use the browserWindow argument to make the dialog modal
    const file = await dialog.showSaveDialog({
      title: "Export", // TODO: a better title
      defaultPath,
      buttonLabel: "Export",
      filters: [filter],
      properties: ["showOverwriteConfirmation"],
    })

    if (file.canceled) {
      return { status: DialogStatus.CANCELED, error: null }
    }

    // filePath is always string if the dialog wasn't cancelled
    const filePath = file.filePath as string

    fs.writeFile(filePath, content)
    shell.showItemInFolder(filePath) // TODO: make this optional
    return { status: DialogStatus.SUCCESS, error: null }
  } catch (error) {
    console.log(error)
    return { status: DialogStatus.ERROR, error }
  }
}
