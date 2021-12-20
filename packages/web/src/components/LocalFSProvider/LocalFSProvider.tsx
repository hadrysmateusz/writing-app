import { useState, useCallback } from "react"

import { DirObjectRecursive } from "shared"

import { createContext } from "../../utils"

import { useValidateDirs } from "../PrimarySidebar/Local"
import { DirState } from "./types"
import { useFetchInitialDirTrees } from "./useFetchInitialDirTrees"
import { useSetUpWatchers } from "./useSetUpWatchers"

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

const LocalFSProvider: React.FC = ({ children }) => {
  const [dirState, setDirState] = useState<DirState>({
    isLoading: false,
    dirTrees: [],
  })

  // TODO: rename these to avoid confusing with dirState properties
  const { dirs, updateDirs } = useValidateDirs()

  useFetchInitialDirTrees(dirs, setDirState)

  const isReadyToSetUpWatchers =
    !dirState.isLoading && dirState.dirTrees.length > 0

  useSetUpWatchers(isReadyToSetUpWatchers, dirState.dirTrees, setDirState)

  // ============== API methods ======================

  // TODO: rename to createFile
  const createDocument = useCallback(async (defaultPath?: string) => {
    await window.electron.invoke("CREATE_FILE", {
      defaultPath,
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
