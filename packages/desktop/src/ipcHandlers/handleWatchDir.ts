import path from "path"
import chokidar from "chokidar"
import mime from "mime-types"

import { DialogStatus } from "../types"
import {
  ALLOWED_DOCUMENT_FILE_TYPES,
  closeWatcherForDir,
  getDirWatchers,
  getMainWindow,
} from "../helpers"

export const handleWatchDir = async (
  _event,
  payload: {
    watchedDirPath: string
  }
) => {
  try {
    const { watchedDirPath } = payload
    console.log(`setting up dir watcher for ${watchedDirPath}`, payload)

    // TODO: ensure or just check for path

    const watcher = chokidar.watch(watchedDirPath, {
      persistent: true,
      ignoreInitial: true,
    })
    const watcherClose = () => {
      const boundClose = watcher.close.bind(watcher)
      return boundClose()
    }
    await closeWatcherForDir(watchedDirPath)
    getDirWatchers()[watchedDirPath] = {
      close: watcherClose,
      added: Date.now(),
    }
    console.log("saved watcher")
    console.log(getDirWatchers())

    const sendResponse = ({
      eventType,
      itemPath,
    }: {
      eventType: string
      itemPath: string
    }) => {
      console.log(itemPath + " " + eventType)
      const parentDirPath = path.dirname(itemPath)
      const itemName = path.basename(itemPath)

      console.log("parentDirPath: ", parentDirPath)
      console.log("search for: ", watchedDirPath)
      let relativePath = parentDirPath.replace(watchedDirPath, "")
      console.log("relativePath: ", relativePath)

      const dirPathArr = relativePath.split(path.sep)
      console.log("dirPathArr: ", dirPathArr)

      const parentDirPathArr = dirPathArr.map((_fragment, i, fragArr) => {
        let newActualDirPath = watchedDirPath
        for (let j = 0; j <= i; j++) {
          newActualDirPath = path.join(newActualDirPath, fragArr[j])
          newActualDirPath = path.normalize(newActualDirPath)
        }
        return newActualDirPath
      })
      console.log("parentDirPathArr", parentDirPathArr)

      getMainWindow().webContents.send("WATCH_DIR:RES", {
        eventType: eventType,
        watchedDirPath,

        itemPath,
        itemName,
        parentDirPath: parentDirPath,
        parentDirPathArr: parentDirPathArr,
      })
    }

    // const onWatcherReady = async () => {
    //   console.log("watcher ready")
    //   // TODO: refactoring
    //   await closeWatcherForDir(watchedDirPath)
    //   getDirWatchers()[watchedDirPath] = {
    //     close: watcherClose,
    //     added: Date.now(),
    //   }
    //   console.log("saved watcher")
    //   console.log(getDirWatchers())
    // }

    const onWatcherAdd = (itemPath: string) => {
      const fileType = mime.lookup(itemPath)
      // console.log("FILE TYPE:", fileType)
      if (!ALLOWED_DOCUMENT_FILE_TYPES.includes(fileType)) {
        console.log(`unsupported file type ${fileType}, skipping`)
        return
      }
      sendResponse({ eventType: "add", itemPath })
    }

    const onWatcherUnlink = (itemPath: string) => {
      sendResponse({ eventType: "unlink", itemPath })
    }

    const onWatcherAddDir = (itemPath: string) => {
      sendResponse({ eventType: "addDir", itemPath })
    }

    const onWatcherUnlinkDir = (itemPath: string) => {
      sendResponse({ eventType: "unlinkDir", itemPath })
    }

    watcher
      // .on("ready", onWatcherReady)
      .on("add", onWatcherAdd)
      .on("unlink", onWatcherUnlink)
      .on("addDir", onWatcherAddDir)
      .on("unlinkDir", onWatcherUnlinkDir)

    return {
      status: DialogStatus.SUCCESS,
      error: null,
      data: {},
    }
  } catch (err) {
    console.log("Error in WATCH_DIR handler:")
    console.log(err)
    return {
      status: DialogStatus.ERROR,
      error: err,
      data: null,
    }
  }

  // TODO: handle add/unlink dir events

  // More possible events.
  // watcher
  //   .on("addDir", (path) => log(`Directory ${path} has been added`))
  //   .on("unlinkDir", (path) => log(`Directory ${path} has been removed`))
  //   .on("error", (error) => log(`Watcher error: ${error}`))
  //   .on("ready", () => log("Initial scan complete. Ready for changes"))
  // .on("change", (path) => console.log(`File ${path} has been changed`))
  // .on("error", (error) => console.log(`Watcher error: ${error}`))
}
