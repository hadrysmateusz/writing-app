import { cloneDeep } from "lodash"
import { useEffect, useState } from "react"

import { useToggleable } from "../../../../hooks"
import { formatOptional } from "../../../../utils"
import { findDirInDir } from "./helpers"

import { LocalDocumentSectionHeader } from "./LocalDocumentSectionHeader"
import { LocalDocumentSidebarItem } from "./LocalDocumentSidebarItem"
import { FileObject, DirObjectRecursive } from "./types"

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
        removeDir={removeDir}
        isOpen={isOpen}
        onToggle={toggle}
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
    window.electron.invoke("GET_FILES_AT_PATH", { path }).then((res) => {
      console.log("get_files_at_path", res)
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

      handleWatchDirResponse = ({
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
      }) => {
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
            // console.log("file added:", filePath)
            // console.log("dirPathArr", dirPathArr)

            setDirState((prevDirState) => {
              if (!prevDirState) {
                return undefined
              }

              const resultDir = findDirInDir(prevDirState, dirPathArr, 0)

              if (resultDir) {
                addFileToDirFiles(resultDir, {
                  path: filePath,
                  name: fileName,
                })
              }

              console.log("resultDir after mod", resultDir)

              return prevDirState
            })
          }
          if (eventType === "unlink") {
            // console.log("file removed:", filePath)
            // console.log("dirPathArr", dirPathArr)

            setDirState((prevDirState) => {
              if (!prevDirState) {
                return undefined
              }

              const resultDir = findDirInDir(prevDirState, dirPathArr, 0)

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

  return !isEmpty ? (
    <>
      <LocalDocumentSectionHeader
        path={path}
        removeDir={removeDir}
        isOpen={isOpen}
        onToggle={toggle}
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
    </>
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

// ===========================================================================

// export const ChildDirs: React.FC<{
//   dirs: (DirObject | ValidatePathsObj)[]
//   handleRemovePath: (path: string) => void
//   startOpen?: boolean
// }> = ({ dirs, handleRemovePath, startOpen = false }) => {
//   return (
//     <>
//       {dirs.map((dir) => (
//         <DirItem
//           key={dir.path}
//           path={dir.path}
//           exists={"exists" in dir ? dir.exists : undefined}
//           name={formatOptional(dir.name, "Unknown")}
//           removeDir={handleRemovePath}
//           startOpen={startOpen}
//         />
//       ))}
//     </>
//   )
// }

// export const DirItemInner: React.FC<{
//   path: string
//   removeDir: (path: string) => void
// }> = ({ path, removeDir }) => {
//   const [files, setFiles] = useState<FileObject[]>([])
//   const [dirs, setDirs] = useState<DirObject[]>([])

//   useEffect(() => {
//     window.electron.invoke("GET_FILES_AT_PATH", { path }).then((res) => {
//       console.log(res)
//       if (res.status === "success") {
//         const { dirObj } = res.data
//         // setFiles(dirObj.files)
//         setDirs(dirObj.dirs)
//       } else {
//         console.log("NOT SUCCESS :C")
//       }
//     })
//   }, [path])

//   useEffect(() => {
//     window.electron.invoke("WATCH_DIR", { dirPath: path })
//     window.electron.receive(
//       "WATCH_DIR:FILE_ADDED",
//       ({ dirPath, filePath, fileName }) => {
//         if (dirPath === path) {
//           console.log("file added:", filePath)
//           setFiles((prevFiles) => [
//             ...prevFiles,
//             { path: filePath, name: fileName },
//           ])
//         }
//       }
//     )
//   }, [path])

//   return files.length === 0 ? (
//     <Empty>Empty</Empty>
//   ) : (
//     <>
//       <LocalDocumentItemsList files={files} />
//       {dirs.map((dir) => (
//         <DirItem
//           key={dir.path}
//           path={dir.path}
//           name={formatOptional(dir.name, "Unknown")}
//           removeDir={removeDir}
//           // exists={"exists" in dir ? dir.exists : undefined}
//           // startOpen={startOpen}
//         />
//       ))}
//     </>
//   )
// }
