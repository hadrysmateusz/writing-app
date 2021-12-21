import { useEffect } from "react"
import cloneDeep from "lodash/cloneDeep"

import { DirObjectRecursive, WatchDirResPayload } from "shared"
import {
  addDirToDirDirs,
  addFileToDirFiles,
  getDirToModify,
  removeDirFromDirDirs,
  removeFileFromDirFiles,
} from "./helpers"
import { DirState } from "./types"

const setUpFileWatcherForPath = async (path: string) => {
  const res = await window.electron.invoke("WATCH_DIR", {
    watchedDirPath: path,
  })
  console.log("WATCH_DIR response", res)
  return res
}

export const useSetUpWatchers = (
  isReady: boolean,
  dirTrees: DirObjectRecursive[],
  setDirState: React.Dispatch<React.SetStateAction<DirState>>
) => {
  useEffect(() => {
    // we only initiate watching after initial load is done
    if (!isReady) {
      return undefined
    }

    const handleWatchDirResponse = (res: WatchDirResPayload) => {
      console.log("=====================WATCH_DIR:RES======================")
      console.log(res)

      const { eventType } = res

      switch (eventType) {
        case "add": {
          setDirState((prevDirState) => {
            const resultDir = getDirToModify(prevDirState, res)

            if (resultDir) {
              addFileToDirFiles(resultDir, res.file)
            }

            return cloneDeep(prevDirState)
          })
          break
        }
        case "unlink": {
          setDirState((prevDirState) => {
            const resultDir = getDirToModify(prevDirState, res)

            if (resultDir) {
              removeFileFromDirFiles(resultDir, res.itemPath)
            }

            return cloneDeep(prevDirState)
          })
          break
        }
        case "addDir": {
          setDirState((prevDirState) => {
            const resultDir = getDirToModify(prevDirState, res)

            if (resultDir) {
              addDirToDirDirs(resultDir, res.dirTree)
            }

            return cloneDeep(prevDirState)
          })
          break
        }
        case "unlinkDir": {
          setDirState((prevDirState) => {
            const resultDir = getDirToModify(prevDirState, res)

            if (resultDir) {
              removeDirFromDirDirs(resultDir, res.itemPath)
            }

            return cloneDeep(prevDirState)
          })
          break
        }
        default: {
          console.log("unknown eventType", eventType)
        }
      }
    }

    ;(async () => {
      for (let dirTree of dirTrees) {
        console.log("setting up watcher for", dirTree.path)
        setUpFileWatcherForPath(dirTree.path)
      }
      window.electron.receive("WATCH_DIR:RES", handleWatchDirResponse)
    })()

    return () => {
      for (let dirTree of dirTrees) {
        console.log("invoking stop watch dir for:", dirTree.path)
        window.electron.invoke("STOP_WATCH_DIR", {
          watchedDirPath: dirTree.path,
          timestamp: Date.now(),
        })
      }

      window.electron.removeListener("WATCH_DIR:RES", handleWatchDirResponse)
    }
  }, [dirTrees, isReady, setDirState])
}
