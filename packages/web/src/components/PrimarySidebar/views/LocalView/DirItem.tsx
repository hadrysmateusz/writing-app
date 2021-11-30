import { useEffect, useState } from "react"

import { useToggleable } from "../../../../hooks"

import { LocalDocumentSectionHeader } from "./LocalDocumentSectionHeader"
import { LocalDocumentSidebarItem } from "./LocalDocumentSidebarItem"
import { DirObject, FileObject } from "./types"

export const DirItem: React.FC<{
  path: string
  name: string
  removeDir: (path: string) => void
}> = ({ path, name, removeDir }) => {
  const [files, setFiles] = useState<FileObject[]>([])
  const [dirs, setDirs] = useState<DirObject[]>([])

  useEffect(() => {
    window.electron.invoke("GET_FILES_AT_PATH", { path }).then((res) => {
      console.log(res)
      if (res.status === "success") {
        const { dirObj } = res.data
        setFiles(dirObj.files)
        setDirs(dirObj.dirs)
      } else {
        console.log("NOT SUCCESS :C")
      }
    })
  }, [path])

  return (
    <NestedDirItem
      path={path}
      name={name}
      files={files}
      dirs={dirs}
      removeDir={removeDir}
      startOpen={true}
    />
  )
}

const NestedDirItem: React.FC<
  DirObject & { removeDir: (path: string) => void; startOpen?: boolean }
> = ({ path, name, dirs, files, removeDir, startOpen = false }) => {
  const { isOpen, toggle } = useToggleable(startOpen)

  return files.length > 0 ? (
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
        <>
          {files.map((file) => (
            <LocalDocumentSidebarItem
              key={file.path}
              path={file.path}
              name={file.name}
            />
          ))}
          {dirs.map((dir) => (
            <NestedDirItem key={dir.path} {...dir} removeDir={removeDir} />
          ))}
        </>
      ) : null}
    </>
  ) : null
}
