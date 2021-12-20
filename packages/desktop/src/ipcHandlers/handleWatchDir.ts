import fs from "fs-extra"

import { IpcResponseStatus, WatchDirPayload } from "shared"

import { closeWatcherForDir, createAndSaveWatcher } from "../helpers"

import { dirWatcherEventHandler as createHandler } from "./handleWatchDir.helpers"

export const handleWatchDir = async (_event, payload: WatchDirPayload) => {
  try {
    const { watchedDirPath } = payload

    console.log(`setting up dir watcher for ${watchedDirPath}`, payload)

    // Ensure the directory exists
    fs.ensureDirSync(watchedDirPath) // TODO: maybe just check and report if it's missing

    // Close previous watcher
    await closeWatcherForDir(watchedDirPath)

    // Create new watcher (and save it)
    const watcher = createAndSaveWatcher(watchedDirPath)

    // Create handler creator for watched dir
    const createHandlerForEvent = createHandler(watchedDirPath)

    // Set up watcher event handlers
    watcher
      .on("add", createHandlerForEvent("add"))
      .on("unlink", createHandlerForEvent("unlink"))
      .on("addDir", createHandlerForEvent("addDir"))
      .on("unlinkDir", createHandlerForEvent("unlinkDir"))

    return {
      status: IpcResponseStatus.SUCCESS,
      error: null,
      data: {},
    }
  } catch (err) {
    console.log("Error in WATCH_DIR handler:", err)
    return {
      status: IpcResponseStatus.ERROR,
      error: err,
      data: null,
    }
  }
}

// const getParentDirPathArr = (relativePath: string, watchedDirPath: string) => {
//   const relativePathSegmentArr = relativePath.split(path.sep)
//   return relativePathSegmentArr.map((_segment, i, segmentArr) => {
//     let newActualDirPath = watchedDirPath
//     for (let j = 0; j <= i; j++) {
//       newActualDirPath = path.join(newActualDirPath, segmentArr[j])
//       newActualDirPath = path.normalize(newActualDirPath)
//     }
//     return newActualDirPath
//   })
// }

// const getResponseMetaValues = (
//   eventType: string,
//   watchedDirPath: string,
//   itemPath: string
// ) => {
//   const resourceType = getResourceType(itemPath)

//   if (!resourceType) {
//     throw new Error("Invalid resource type")
//   }

//   return {
//     eventType,
//     watchedDirPath,
//     resourceType,
//   }
// }

// const getCommonResourceValues = (
//   watchedDirPath: string,
//   itemPath: string
// ): Pick<
//   WatchDirResPayload,
//   "itemPath" | "itemName" | "parentDirPath" | "parentDirPathArr"
// > => {
//   const parentDirPath = path.dirname(itemPath)
//   const itemName = path.basename(itemPath)
//   const relativePath = parentDirPath.replace(watchedDirPath, "")
//   const parentDirPathArr = getParentDirPathArr(relativePath, watchedDirPath)

//   console.log("- parentDirPath: ", parentDirPath)
//   console.log("- relativePath: ", relativePath)
//   console.log("- parentDirPathArr", parentDirPathArr)

//   return {
//     itemPath,
//     itemName,
//     parentDirPath,
//     parentDirPathArr,
//   }
// }

// const createResponse = (
//   eventType: string,
//   watchedDirPath: string,
//   itemPath: string
// ) => {
//   const DIR_EVENT_TYPES = ["addDir", "unlinkDir"]

//   try {
//     const responseMetaValues = getResponseMetaValues(
//       eventType,
//       watchedDirPath,
//       itemPath
//     )

//     const dirTree = DIR_EVENT_TYPES.includes(eventType)
//       ? createDirObjectRecursive(itemPath)
//       : undefined

//     const commonResourceValues = getCommonResourceValues(
//       watchedDirPath,
//       itemPath
//     )

//     const responseObject = {
//       ...responseMetaValues,
//       ...commonResourceValues,
//       dirTree,
//     }

//     return responseObject
//   } catch (error) {
//     return null
//   }
// }

// const sendResponse = (resPayload: WatchDirResPayload) => {
//   console.log(`watcher event ${resPayload.eventType}: itemPath`)
//   getMainWindow().webContents.send("WATCH_DIR:RES", resPayload)
// }

// const createAndSendResponse = (
//   eventType: string,
//   watchedDirPath: string,
//   itemPath: string
// ) => {
//   const responseObject = createResponse(eventType, watchedDirPath, itemPath)
//   if (!responseObject) {
//     console.log("there was an issue creating response object")
//     return
//   }
//   sendResponse(responseObject)
// }
