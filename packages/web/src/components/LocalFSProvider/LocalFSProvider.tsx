import { useState, useCallback } from "react"
import { ValidatePathsObj } from "shared"

import { GenericDocGroupTreeBranch } from "../../types"
import { createContext } from "../../utils"
import { getConfirmModalContent, useConfirmModal } from "../ConfirmModal"

import { useValidateDirs } from "../PrimarySidebar/Local"

import { DirState } from "./types"
import { useFetchInitialDirTrees } from "./useFetchInitialDirTrees"
import { useSetUpWatchers } from "./useSetUpWatchers"

const ConfirmDeleteFileModalContent = getConfirmModalContent({
  confirmMessage: "Delete",
  promptMessage: "Are you sure you want to delete this file?",
  secondaryPromptMessage: "This action can't be undone",
})
const ConfirmDeleteDirModalContent = getConfirmModalContent({
  confirmMessage: "Delete",
  promptMessage: "Are you sure you want to delete this folder?",
  secondaryPromptMessage: "This action can't be undone",
})

type LocalFSContextType = {
  dirTrees: GenericDocGroupTreeBranch[]
  validatePathObjects: ValidatePathsObj[]

  createDocument: (defaultPath?: string) => void
  createDir: (name: string, parentPath?: string) => void
  deleteDir: (dirPath: string) => Promise<void>
  revealItem: (targetPath: string) => void
  deleteFile: (targetPath: string) => Promise<void>
  addPath: (defaultPath?: string) => void
  removePath: (path: string) => void
}

// TODO: when adding or removing path from library make sure the tree in navigator sidebar gets updated too

const [LocalFSContext, useLocalFS] = createContext<LocalFSContextType>()

const LocalFSProvider: React.FC = ({ children }) => {
  const {
    open: openConfirmDeleteFileModal,
    Modal: ConfirmDeleteFileModal,
    isOpen: isConfirmDeleteFileModalOpen,
  } = useConfirmModal()
  const {
    open: openConfirmDeleteDirModal,
    Modal: ConfirmDeleteDirModal,
    isOpen: isConfirmDeleteDirModalOpen,
  } = useConfirmModal()

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

  const deleteFile = useCallback(
    async (targetPath: string) => {
      const result = await openConfirmDeleteFileModal({})

      if (result === true) {
        window.electron.invoke("DELETE_FILE", { targetPath })
      }
    },
    [openConfirmDeleteFileModal]
  )

  const createDir = useCallback(async (name: string, parentPath?: string) => {
    await window.electron.invoke("CREATE_DIR", {
      name,
      parentPath,
    })
  }, [])

  const deleteDir = useCallback(
    async (dirPath: string) => {
      const result = await openConfirmDeleteDirModal({})

      if (result === true) {
        await window.electron.invoke("DELETE_DIR", {
          dirPath,
        })
      }
    },
    [openConfirmDeleteDirModal]
  )

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

  console.log("dirState", dirState)

  return (
    <>
      <LocalFSContext.Provider
        value={{
          dirTrees: dirState.dirTrees,
          validatePathObjects: dirs,
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

      {isConfirmDeleteFileModalOpen ? (
        <ConfirmDeleteFileModal component={ConfirmDeleteFileModalContent} />
      ) : null}

      {isConfirmDeleteDirModalOpen ? (
        <ConfirmDeleteDirModal component={ConfirmDeleteDirModalContent} />
      ) : null}
    </>
  )
}

export { useLocalFS, LocalFSProvider }
