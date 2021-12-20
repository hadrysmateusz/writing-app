import { FileObject, DirObjectRecursive } from "shared"

import { useIsHovered, useToggleable } from "../../../hooks"
import { formatOptional } from "../../../utils"

import { useLocalFS } from "../../LocalFSProvider"
import { LocalDocumentSectionHeader } from "../../DocumentsList/SectionHeader"
import { LocalDocumentSidebarItem } from "../../DocumentsList/SidebarDocumentItem"

import { PrimarySidebarSectionContainer } from "../PrimarySidebar.styles"
import { LocalSettings } from "../../Database"

export const DirItem: React.FC<
  DirObjectRecursive & {
    // exists?: boolean
    startOpen?: boolean
    listType?: LocalSettings["documentsListDisplayType"]
  }
> = ({ path, name, files, dirs, startOpen = false, listType }) => {
  const { isOpen, toggle } = useToggleable(startOpen)
  const { deleteDir } = useLocalFS()

  const isEmpty = files.length === 0 && dirs.length === 0

  const { getHoverContainerProps, isHovered } = useIsHovered()

  return !isEmpty ? (
    <PrimarySidebarSectionContainer isHovered={isHovered}>
      <LocalDocumentSectionHeader
        path={path}
        isOpen={isOpen}
        onToggle={toggle}
        removeDir={deleteDir}
        {...getHoverContainerProps()}
      >
        {formatOptional(name, "Unknown")}
      </LocalDocumentSectionHeader>
      {isOpen ? (
        <LocalDocumentsSubGroupInner
          dirs={dirs}
          files={files}
          listType={listType}
        />
      ) : null}
    </PrimarySidebarSectionContainer>
  ) : null
}

// TODO: remove duplication with DocumentsList
// TODO: add empty state (maybe)
export const LocalDocumentItemsList: React.FC<{
  files: FileObject[]
  listType?: LocalSettings["documentsListDisplayType"]
}> = ({ files }) => (
  <>
    {files.map((file) => (
      <LocalDocumentSidebarItem key={file.path} file={file} />
    ))}
  </>
)

// TODO: make both tree and flat variants
export const LocalDocumentsSubGroupInner: React.FC<{
  files: FileObject[]
  dirs: DirObjectRecursive[]
  listType?: LocalSettings["documentsListDisplayType"]
}> = ({ files, dirs, listType }) => {
  return (
    <>
      <LocalDocumentItemsList files={files} listType={listType} />
      {dirs.map((dir) => (
        <DirItem
          key={dir.path}
          listType={listType}
          {...dir}
          // exists={"exists" in dir ? dir.exists : undefined}
        />
      ))}
    </>
  )
}
