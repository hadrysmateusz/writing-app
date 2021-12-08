import { useEffect, useState } from "react"

import { useToggleable } from "../../../../hooks"
import { formatOptional } from "../../../../utils"

import { LocalDocumentSectionHeader } from "./LocalDocumentSectionHeader"
import { LocalDocumentSidebarItem } from "./LocalDocumentSidebarItem"
import { FileObject, DirObjectRecursive } from "./types"
import { findDirInDir } from "./helpers"
import { cloneDeep } from "lodash"

// TODO: rename
export const DirItemTopLevel: React.FC<{
  path: string
  name: string
  exists?: boolean
  startOpen?: boolean
  removeDir: (path: string) => void
}> = ({ path, name, removeDir, startOpen = false }) => {
  const { isOpen, toggle } = useToggleable(startOpen)

  return (
    <>
      <LocalDocumentSectionHeader
        path={path}
        isOpen={isOpen}
        onToggle={toggle}
        removeDir={removeDir}
      >
        {name}
      </LocalDocumentSectionHeader>
      {isOpen ? (
        <DirItemInnerTopLevel path={path} removeDir={removeDir} />
      ) : null}
    </>
  )
}

export const DirItemInnerTopLevel: React.FC<{
  path: string
  removeDir: (path: string) => void
}> = ({ path, removeDir }) => {
  const [dirState, setDirState] = useState<DirObjectRecursive>()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(false)
    window.electron.invoke("GET_PATH_CONTENTS", { path }).then((res) => {
      console.log("GET_PATH_CONTENTS", res)
      if (res.status === "success") {
        setDirState(res.data.dirObj)
        setIsReady(true)
      } else if (res.status === "error") {
        console.log(res.error)
      } else {
        console.log(res)
        throw new Error("something went wrong")
      }
    })
  }, [path])

  useEffect(() => {
    let handleWatchDirResponse
    // we only initiate watching after initial load is done
    if (isReady) {
      window.electron.invoke("WATCH_DIR", { dirPath: path }).then((res) => {
        console.log("WATCH_DIR response", res)
      })

      handleWatchDirResponse = (res) => {
        const {
          dirPath,
          filePath,
          fileDirPath,
          dirPathArr,
          fileName,
          eventType,
        }: {
          dirPath: string
          filePath: string
          fileDirPath: string
          dirPathArr: string[]
          fileName: string
          eventType: string
        } = res

        console.log("===========================================")
        console.log(res)
        // ========= HELPERS ==========

        const addFileToDirFiles = (
          dir: DirObjectRecursive,
          fileToAdd: FileObject
        ) => {
          // check for existance first to prevent duplication
          if (dir.files.find((file) => file.path === filePath)) {
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

        // ========= LOGIC ==========

        if (dirPath === path) {
          // TODO: switch to switch statement
          if (eventType === "add") {
            setDirState((prevDirState) => {
              if (!prevDirState) {
                return undefined
              }

              const resultDir =
                fileDirPath === prevDirState.path
                  ? prevDirState
                  : findDirInDir(prevDirState, dirPathArr, 0)

              console.log("resultDir", resultDir)

              if (resultDir) {
                addFileToDirFiles(resultDir, {
                  path: filePath,
                  name: fileName,
                })
              }

              console.log("resultDir after mod", resultDir)

              return cloneDeep(prevDirState)
            })
          }
          if (eventType === "unlink") {
            setDirState((prevDirState) => {
              if (!prevDirState) {
                return undefined
              }

              const resultDir = findDirInDir(prevDirState, dirPathArr, 0)
              console.log("resultDir", resultDir)

              if (resultDir) {
                removeFileFromDirFiles(resultDir, filePath)
              }

              console.log("resultDir after mod", resultDir)

              return cloneDeep(prevDirState)
            })
          }
        }
      }

      window.electron.receive("WATCH_DIR:RES", handleWatchDirResponse)
    }

    return () => {
      window.electron.invoke("STOP_WATCH_DIR", {
        dirPath: path,
        timestamp: Date.now(),
      })
      if (handleWatchDirResponse) {
        window.electron.removeListener("WATCH_DIR:RES", handleWatchDirResponse)
      }
    }
  }, [isReady, path])

  const isEmpty =
    dirState && dirState.files.length === 0 && dirState.dirs.length === 0

  return dirState ? (
    isEmpty ? (
      <div>TODO: CREATE EMPTY STATE</div>
    ) : (
      <>
        <LocalDocumentItemsList files={dirState.files} />
        {dirState.dirs.map((dir) => (
          <DirItem
            key={dir.path}
            {...dir}
            removeDir={removeDir}
            // exists={"exists" in dir ? dir.exists : undefined}
            // startOpen={startOpen}
          />
        ))}
      </>
    )
  ) : null
}

export const DirItem: React.FC<
  DirObjectRecursive & {
    // exists?: boolean
    startOpen?: boolean
    removeDir: (path: string) => void
  }
> = ({ path, name, files, dirs, removeDir, startOpen = false }) => {
  const { isOpen, toggle } = useToggleable(startOpen)

  const isEmpty = files.length === 0 && dirs.length === 0

  // TODO: reduce duplication with subgroups
  const [isHovered, setIsHovered] = useState(false)
  const handleMouseEnter = (e) => {
    setIsHovered(true)
  }
  const handleMouseLeave = (e) => {
    setIsHovered(false)
  }
  return !isEmpty ? (
    <PrimarySidebarSectionContainer isHovered={isHovered}>
      <LocalDocumentSectionHeader
        path={path}
        isOpen={isOpen}
        onToggle={toggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {formatOptional(name, "Unknown")}
      </LocalDocumentSectionHeader>
      {isOpen ? (
        <>
          <LocalDocumentItemsList files={files} />
          {dirs.map((dir) => (
            <DirItem
              key={dir.path}
              {...dir}
              removeDir={removeDir}
              // exists={"exists" in dir ? dir.exists : undefined}
              // startOpen={startOpen}
            />
          ))}
        </>
      ) : null}
    </PrimarySidebarSectionContainer>
  ) : null
}

// TODO: remove duplication with DocumentsList
// TODO: add empty state (maybe)
const LocalDocumentItemsList: React.FC<{ files: FileObject[] }> = ({
  files,
}) => (
  <>
    {files.map((file) => (
      <LocalDocumentSidebarItem
        key={file.path}
        path={file.path}
        name={file.name}
      />
    ))}
  </>
)
