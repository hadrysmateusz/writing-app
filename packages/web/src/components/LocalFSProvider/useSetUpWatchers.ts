import { useEffect, useCallback, useMemo, useRef } from "react"
import cloneDeep from "lodash/cloneDeep"

import { WatchDirResPayload } from "shared"

import { GenericDocGroupTreeBranch } from "../../types"

import {
  addDirToDirDirs,
  addFileToDirFiles,
  getDirToModify,
  removeDirFromDirDirs,
  removeFileFromDirFiles,
} from "./helpers"
import { DirState } from "./types"
import {
  createGenericDocumentFromLocalFile,
  createGenericGroupTreeFromLocalDir,
} from "../../helpers"

export const useSetUpWatchers = (
  isReady: boolean,
  dirTrees: GenericDocGroupTreeBranch[],
  setDirState: React.Dispatch<React.SetStateAction<DirState>>
) => {
  const handleWatchDirResponse = useCallback(
    (res: WatchDirResPayload) => {
      console.log("=====================WATCH_DIR:RES======================")
      console.log(res)

      const { eventType } = res

      switch (eventType) {
        case "add": {
          setDirState((prevDirState) => {
            const resultDir = getDirToModify(prevDirState, res)
            const genericDocument = createGenericDocumentFromLocalFile(res.file)

            if (resultDir) {
              addFileToDirFiles(resultDir, genericDocument)
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
            const genericGroup = createGenericGroupTreeFromLocalDir(res.dirTree)

            if (resultDir) {
              addDirToDirDirs(resultDir, genericGroup)
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
    },
    [setDirState]
  )

  const dirTreesRef = useRef<GenericDocGroupTreeBranch[]>(dirTrees)
  dirTreesRef.current = dirTrees

  // This string is used as dependency in the useEffect hook to check whether the dirTree paths have changed without relying on the dirTrees object
  const dirPathsString: string = useMemo(
    () =>
      dirTrees
        .map((dir) => dir.identifier)
        .sort()
        .join(";"),
    [dirTrees]
  )

  useEffect(() => {
    console.log(
      "---------------------------------SETUP WATCHERS EFFECT HOOK---------------------------------"
    )
    // we only initiate watching after initial load is done
    if (!isReady) {
      return undefined
    }

    // The dirPathsString dependency is essential for this effect to work so don't remove this line or eventually it's get removed from deps array by mistake )
    console.info(dirPathsString)

    // The concatenated paths string isn't used to source the dirPaths because it's hard to find a separator string that is GUARANTEED to never be in any path
    // We create this here to avoid relying on a ref value in the cleanup method and make sure listeners are both registered and removed for the same set of paths
    const dirPaths = Object.freeze(
      cloneDeep(dirTreesRef.current.map((dir) => dir.identifier))
    )

    for (let dirPath of dirPaths) {
      console.log("setting up watcher for", dirPath)
      if (dirPath === null) {
        return
      }

      window.electron
        .invoke("WATCH_DIR", {
          watchedDirPath: dirPath,
        })
        .then((res) => {
          console.log("WATCH_DIR response", res)
        })
    }

    window.electron.receive("WATCH_DIR:RES", handleWatchDirResponse)

    return () => {
      for (let dirPath of dirPaths) {
        console.log("invoking stop watch dir for:", dirPath)
        window.electron.invoke("STOP_WATCH_DIR", {
          watchedDirPath: dirPath,
          timestamp: Date.now(),
        })
      }

      window.electron.removeListener("WATCH_DIR:RES", handleWatchDirResponse)
    }
  }, [dirPathsString, handleWatchDirResponse, isReady])
}
