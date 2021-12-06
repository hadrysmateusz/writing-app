import path from "path"
import chokidar from "chokidar"

import { DialogStatus } from "../types"
import { closeWatcherForDir, getDirWatchers, getMainWindow } from "../helpers"

export const handleWatchDir = async (
  _event,
  payload: {
    dirPath: string
  }
) => {
  try {
    const { dirPath } = payload
    console.log("main handling WATCH_DIR event")

    // TODO: ensure or just check for path

    const watcher = chokidar.watch(dirPath, {
      persistent: true,
      ignoreInitial: true,
    })

    const sendResponse = ({
      eventType,
      filePath,
    }: {
      eventType: string
      filePath: string
    }) => {
      console.log("file " + filePath + " " + eventType)
      const fileDirPath = path.dirname(filePath)
      const fileName = path.basename(filePath)

      // console.log("fileDirPath: ", fileDirPath)
      // console.log("search for: ", dirPath)
      let relativePath = fileDirPath.replace(dirPath, "")
      // console.log("relativePath: ", relativePath)

      const dirPathArr = relativePath.split(path.sep)
      // console.log("dirPathArr: ", dirPathArr)

      const actualDirPathArr = dirPathArr.map((_fragment, i, fragArr) => {
        let newActualDirPath = dirPath
        for (let j = 0; j <= i; j++) {
          newActualDirPath = path.join(newActualDirPath, fragArr[j])
          newActualDirPath = path.normalize(newActualDirPath)
        }
        return newActualDirPath
      })
      // console.log("actualDirPathArr", actualDirPathArr)

      getMainWindow().webContents.send("WATCH_DIR:RES", {
        eventType: eventType,
        dirPath,
        filePath,
        fileDirPath,
        dirPathArr: actualDirPathArr,
        fileName,
      })
    }

    const onWatcherReady = async () => {
      // TODO: refactoring
      await closeWatcherForDir(dirPath)
      getDirWatchers()[dirPath] = {
        close: watcher.close.bind(watcher),
        added: Date.now(),
      }
      console.log("saved watcher")
      console.log(getDirWatchers())
    }

    const onWatcherAdd = (path: string) => {
      sendResponse({ eventType: "add", filePath: path })
    }

    const onWatcherUnlink = (path: string) => {
      sendResponse({ eventType: "unlink", filePath: path })
    }

    watcher
      .on("ready", onWatcherReady)
      .on("add", onWatcherAdd)
      .on("unlink", onWatcherUnlink)

    return {
      status: DialogStatus.SUCCESS,
      error: null,
      data: {
        removeWatcher: watcher.close,
      },
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
