import path from "path"
import {
  SupportedResourceTypes,
  WatchDirResCommon,
  WatchDirResPayload,
  WatcherEvent,
} from "shared"

import {
  createDirObjectRecursive,
  createFileObject,
  getMainWindow,
  getResourceType,
} from "../helpers"

export class ResourceTypeMismatchError extends Error {
  constructor(received: any, expected: SupportedResourceTypes) {
    super(
      `Unexpected resource type. \nReceived: ${received}. \nExpected: ${expected} `
    )
    this.name = "ResourceTypeMismatchError"
  }
}

export const dirWatcherEventHandler =
  (watchedDirPath: string) =>
  (eventType: WatcherEvent) =>
  (itemPath: string) => {
    console.log(`watcher event ${eventType}: ${itemPath}`)

    const responseObject = createResponse(eventType, watchedDirPath, itemPath)

    if (!responseObject) {
      console.log("there was an issue creating response object")
      return
    }

    getMainWindow().webContents.send("WATCH_DIR:RES", responseObject)
  }

const createResponse = (
  eventType: WatcherEvent,
  watchedDirPath: string,
  itemPath: string
): WatchDirResPayload | null => {
  try {
    const parentDirPath = path.dirname(itemPath)
    const itemName = path.basename(itemPath)
    const parentDirPathArr = getParentDirPathArr(parentDirPath, watchedDirPath)

    const responseObjectCommon: WatchDirResCommon = {
      itemName,
      itemPath,
      watchedDirPath,
      parentDirPathArr,
    }

    switch (eventType) {
      case "add": {
        const file = createFileObject(parentDirPath, itemName)
        if (!file) throw new Error("Failed to create file object")

        const resourceType = getResourceType(itemPath)
        if (resourceType !== SupportedResourceTypes.file) {
          throw new ResourceTypeMismatchError(
            resourceType,
            SupportedResourceTypes.file
          )
        }

        return {
          ...responseObjectCommon,
          eventType,
          resourceType,
          file,
        }
      }
      case "unlink": {
        return {
          ...responseObjectCommon,
          eventType,
          resourceType: SupportedResourceTypes.file,
          file: null,
        }
      }
      case "addDir": {
        const dirTree = createDirObjectRecursive(itemPath)
        if (!dirTree) throw new Error("Failed to create dir object")

        const resourceType = getResourceType(itemPath)
        if (resourceType !== SupportedResourceTypes.dir) {
          throw new ResourceTypeMismatchError(
            resourceType,
            SupportedResourceTypes.dir
          )
        }

        return {
          ...responseObjectCommon,
          eventType,
          resourceType,
          dirTree,
        }
      }
      case "unlinkDir": {
        return {
          ...responseObjectCommon,
          eventType,
          resourceType: SupportedResourceTypes.dir,
          dirTree: null,
        }
      }
    }
  } catch (error) {
    console.log(error)
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
