import { useState, useEffect, useCallback } from "react"
import cloneDeep from "lodash/cloneDeep"

import { createContext } from "../../utils"

import {
  DirObjectRecursive,
  FileObject,
  ValidatePathsObj,
  findDirInDir,
  useValidateDirs,
} from "../PrimarySidebar/Local"

type DirState = {
  dirTrees: DirObjectRecursive[]
  isLoading: boolean
}
type LocalFSContextType = {
  dirTrees: DirObjectRecursive[]
  createDocument: (defaultPath?: string) => void
  createDir: (name: string, parentPath?: string) => void
  deleteDir: (dirPath: string) => void
  revealItem: (targetPath: string) => void
  deleteFile: (targetPath: string) => void
  addPath: (defaultPath?: string) => void
  removePath: (path: string) => void
}

const [LocalFSContext, useLocalFS] = createContext<LocalFSContextType>()

const fetchInitialDirTreeForPath = async (
  path: string
): Promise<DirObjectRecursive | undefined> => {
  const res = await window.electron.invoke("GET_PATH_CONTENTS", { path })

  console.log("GET_PATH_CONTENTS", res)
  if (res.status === "success") {
    return res.data.dirObj
  } else if (res.status === "error") {
    console.log(res.error)
    return undefined
  } else {
    console.log(res)
    throw new Error("something went wrong")
  }
}

const useFetchInitialDirTrees = (
  dirs: ValidatePathsObj[] | undefined,
  setDirState
) => {
  useEffect(() => {
    if (!dirs) {
      return
    }

    setDirState((prev) => ({ ...prev, isLoading: true }))
    ;(async () => {
      const newDirTrees: DirObjectRecursive[] = []
      for (let dir of dirs) {
        const dirTree = await fetchInitialDirTreeForPath(dir.path)
        if (dirTree) {
          newDirTrees.push(dirTree)
        }
      }
      setDirState({ isLoading: false, dirTrees: newDirTrees })
    })()
  }, [dirs, setDirState])
}

const setUpFileWatcherForPath = async (path: string) => {
  const res = await window.electron.invoke("WATCH_DIR", {
    watchedDirPath: path,
  })
  console.log("WATCH_DIR response", res)
  return res
}

const useSetUpWatchers = (
  isReady: boolean,
  dirTrees: DirObjectRecursive[],
  setDirState: React.Dispatch<React.SetStateAction<DirState>>
) => {
  useEffect(() => {
    // we only initiate watching after initial load is done
    if (!isReady) {
      return undefined
    }

    const handleWatchDirResponse = (res) => {
      console.log("WATCH_DIR:RES", res)
      const {
        eventType,
        watchedDirPath,
        itemPath,
        itemName,
        parentDirPathArr,

        dirTree,
      }: {
        eventType: string
        watchedDirPath: string
        itemPath: string
        itemName: string
        parentDirPathArr: string[]

        dirTree?: DirObjectRecursive
      } = res

      console.log("===========================================")
      console.log(res)
      // ========= HELPERS ==========

      const addFileToDirFiles = (
        dir: DirObjectRecursive,
        fileToAdd: FileObject
      ) => {
        // check for existance first to prevent duplication
        if (dir.files.find((file) => file.path === fileToAdd.path)) {
          return
        }
        dir.files.push(fileToAdd)
      }

      const removeFileFromDirFiles = (
        dir: DirObjectRecursive,
        filePathToRemove: string
      ) => {
        dir.files = dir.files.filter((file) => file.path !== filePathToRemove)
      }

      const addDirToDirDirs = (
        dir: DirObjectRecursive,
        dirToAdd: DirObjectRecursive
      ) => {
        // check for existance first to prevent duplication
        if (dir.dirs.find((innerDir) => innerDir.path === dirToAdd.path)) {
          return
        }
        dir.dirs.push(dirToAdd)
      }

      const removeDirFromDirDirs = (
        dir: DirObjectRecursive,
        dirPathToRemove: string
      ) => {
        dir.dirs = dir.dirs.filter(
          (dirInner) => dirInner.path !== dirPathToRemove
        )
      }

      const findCorrectDirInState = (dirState: DirState, dirPath: string) => {
        return dirState.dirTrees.find((dirTree) => dirTree.path === dirPath)
      }

      // ========= LOGIC ==========

      // TODO: switch to switch statement
      if (eventType === "add") {
        setDirState((prevDirState) => {
          // modify only correct dirTree in state
          const prevDir = findCorrectDirInState(prevDirState, watchedDirPath)

          // Don't modify (TODO: maybe harsher handling could be required, maybe send a STOP_WATCH_DIR to remove a stale watcher)
          if (!prevDir) {
            return prevDirState
          }

          // const resultDir =
          //   fileDirPath === prevDirState.path
          //     ? prevDirState
          //     : findDirInDir(prevDirState, parentDirPathArr, 0)

          // TODO: proper typing for findDirInDir
          const resultDir = findDirInDir(prevDir, parentDirPathArr, 0)

          console.log("resultDir", resultDir)

          if (resultDir) {
            addFileToDirFiles(resultDir, {
              path: itemPath,
              name: itemName,
            })
          }

          console.log("resultDir after mod", resultDir)

          return cloneDeep(prevDirState)
        })
      }
      if (eventType === "unlink") {
        setDirState((prevDirState) => {
          // modify only correct dirTree in state
          const prevDir = findCorrectDirInState(prevDirState, watchedDirPath)

          // Don't modify (TODO: maybe harsher handling could be required, maybe send a STOP_WATCH_DIR to remove a stale watcher)
          if (!prevDir) {
            return prevDirState
          }

          const resultDir = findDirInDir(prevDir, parentDirPathArr, 0)
          console.log("resultDir", resultDir)

          if (resultDir) {
            removeFileFromDirFiles(resultDir, itemPath)
          }

          console.log("resultDir after mod", resultDir)

          return cloneDeep(prevDirState)
        })
      }
      if (eventType === "addDir") {
        setDirState((prevDirState) => {
          // modify only correct dirTree in state
          const prevDir = findCorrectDirInState(prevDirState, watchedDirPath)

          // Don't modify (TODO: maybe harsher handling could be required, maybe send a STOP_WATCH_DIR to remove a stale watcher)
          if (!prevDir) {
            return prevDirState
          }

          const resultDir = findDirInDir(prevDir, parentDirPathArr, 0)
          console.log("resultDir", resultDir)

          if (resultDir) {
            addDirToDirDirs(
              resultDir,
              dirTree || {
                path: itemPath,
                name: itemName,
                files: [],
                dirs: [],
              }
            )
          }

          console.log("resultDir after mod", resultDir)

          return cloneDeep(prevDirState)
        })
      }
      if (eventType === "unlinkDir") {
        setDirState((prevDirState) => {
          // modify only correct dirTree in state
          const prevDir = findCorrectDirInState(prevDirState, watchedDirPath)

          // Don't modify (TODO: maybe harsher handling could be required, maybe send a STOP_WATCH_DIR to remove a stale watcher)
          if (!prevDir) {
            return prevDirState
          }

          const resultDir = findDirInDir(prevDir, parentDirPathArr, 0)
          console.log("resultDir", resultDir)

          if (resultDir) {
            removeDirFromDirDirs(resultDir, itemPath)
          }

          console.log("resultDir after mod", resultDir)

          return cloneDeep(prevDirState)
        })
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

const LocalFSProvider: React.FC = ({ children }) => {
  // const { currentView } = usePrimarySidebar()

  // const isLocalCurrentView = currentView === "local"

  const [dirState, setDirState] = useState<DirState>({
    isLoading: false,
    dirTrees: [],
  })

  // TODO: rename these to avoid confusing with dirState properties
  const { dirs, isLoading: isLoadingDirs, updateDirs } = useValidateDirs()

  useFetchInitialDirTrees(dirs, setDirState)

  const isReadyToSetUpWatchers =
    /* isLocalCurrentView && */ !dirState.isLoading &&
    dirState.dirTrees.length > 0
  useSetUpWatchers(isReadyToSetUpWatchers, dirState.dirTrees, setDirState)

  // ============== API methods ======================

  // TODO: rename to createFile
  const createDocument = useCallback(async (defaultPath?: string) => {
    await window.electron.invoke("CREATE_FILE", {
      defaultPath: defaultPath,
    })
  }, [])

  const deleteFile = useCallback(async (targetPath: string) => {
    window.electron.invoke("DELETE_FILE", { targetPath })
  }, [])

  const createDir = useCallback(async (name: string, parentPath?: string) => {
    await window.electron.invoke("CREATE_DIR", {
      name,
      parentPath,
    })
  }, [])

  const deleteDir = useCallback(async (dirPath: string) => {
    await window.electron.invoke("DELETE_DIR", {
      dirPath,
    })
  }, [])

  const addPath = useCallback(
    async (defaultPath?: string) => {
      if (!dirs) {
        console.warn("dirs is undefined")
        return
      }
      // TODO: make sure there are no duplicate paths
      const res = await window.electron.invoke("ADD_PATH", { defaultPath })
      // TODO: handle other statuses
      if (res.status === "success") {
        const foundIndex = dirs.findIndex(
          (dir) => dir.path === res.data.dirPath
        )
        // only add if this path is not already in the list
        if (foundIndex === -1) {
          updateDirs([
            ...dirs,
            { name: res.data.baseName, path: res.data.dirPath, exists: true },
          ])
        }
      }
    },
    [dirs, updateDirs]
  )

  const removePath = useCallback(
    async (path: string) => {
      if (!dirs) {
        console.warn("dirs is undefined")
        return
      }
      const filteredDirs = dirs.filter((dir) => dir.path !== path)
      updateDirs(filteredDirs)
    },
    [dirs, updateDirs]
  )

  const revealItem = useCallback(async (targetPath: string) => {
    window.electron.invoke("VIEW_IN_EXPLORER", { targetPath })
  }, [])

  return (
    <LocalFSContext.Provider
      value={{
        dirTrees: dirState.dirTrees,
        createDocument,
        createDir,
        deleteDir,
        revealItem,
        deleteFile,
        addPath,
        removePath,
      }}
    >
      {children}
    </LocalFSContext.Provider>
  )
}

export { useLocalFS, LocalFSProvider }
