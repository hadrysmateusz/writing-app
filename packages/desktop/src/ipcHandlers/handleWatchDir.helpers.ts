import path from "path"

import {
  createDirObjectRecursive,
  getMainWindow,
  getResourceType,
} from "../helpers"

const DIR_EVENT_TYPES = ["addDir", "unlinkDir"]

export const dirWatcherEventHandler =
  (watchedDirPath: string) => (itemPath: string) => (eventType: string) => {
    console.log(`watcher event ${eventType}: itemPath`)

    const responseObject = createResponse(eventType, watchedDirPath, itemPath)

    if (!responseObject) {
      console.log("there was an issue creating response object")
      return
    }

    getMainWindow().webContents.send("WATCH_DIR:RES", responseObject)
  }

const createResponse = (
  eventType: string,
  watchedDirPath: string,
  itemPath: string
) => {
  try {
    const resourceType = getResourceType(itemPath)

    if (!resourceType) {
      throw new Error("Invalid resource type")
    }

    const parentDirPath = path.dirname(itemPath)
    const itemName = path.basename(itemPath)
    const parentDirPathArr = getParentDirPathArr(parentDirPath, watchedDirPath)

    // create dirTree if resource is a directory
    const dirTree = DIR_EVENT_TYPES.includes(eventType)
      ? createDirObjectRecursive(itemPath)
      : undefined

    const responseObject = {
      eventType,
      watchedDirPath,
      resourceType,
      itemPath,
      itemName,
      parentDirPath,
      parentDirPathArr,
      dirTree,
    }

    return responseObject
  } catch (error) {
    return null
  }
}

const getParentDirPathArr = (parentDirPath: string, watchedDirPath: string) => {
  const relativePath = parentDirPath.replace(watchedDirPath, "")
  const relativePathSegmentArr = relativePath.split(path.sep)
  return relativePathSegmentArr.map((_segment, i, segmentArr) => {
    let newActualDirPath = watchedDirPath
    for (let j = 0; j <= i; j++) {
      newActualDirPath = path.join(newActualDirPath, segmentArr[j])
      newActualDirPath = path.normalize(newActualDirPath)
    }
    return newActualDirPath
  })
}
