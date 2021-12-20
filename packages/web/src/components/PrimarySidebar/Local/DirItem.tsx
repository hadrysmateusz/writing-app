import { FileObject, DirObjectRecursive } from "shared"

import { useIsHovered, useToggleable } from "../../../hooks"

import { LocalSettings } from "../../Database"

import {
  PrimarySidebarSectionContainer,
  PrimarySidebarToggleableSectionContainer,
} from "../PrimarySidebar.styles"
import { LocalDocumentSectionHeader } from "../SectionHeader"
import { LocalDocumentSidebarItem } from "../SidebarDocumentItem"

export const DirItem: React.FC<{
  dir: DirObjectRecursive
  // exists?: boolean
  startOpen?: boolean
  listType?: LocalSettings["documentsListDisplayType"]
}> = ({ dir, startOpen = false, listType }) => {
  const { isOpen, toggle } = useToggleable(startOpen)

  const { getHoverContainerProps, isHovered } = useIsHovered()

  const isEmpty = dir.files.length === 0 && dir.dirs.length === 0

  return !isEmpty ? (
    <PrimarySidebarSectionContainer isHovered={isHovered}>
      <LocalDocumentSectionHeader
        isOpen={isOpen}
        onToggle={toggle}
        path={dir.path}
        {...getHoverContainerProps()}
      >
        {dir.name}
      </LocalDocumentSectionHeader>
      {isOpen ? (
        <LocalDocumentsSubGroupInner
          dirs={dir.dirs}
          files={dir.files}
          listType={listType}
        />
      ) : null}
    </PrimarySidebarSectionContainer>
  ) : null
}

// TODO: remove duplication with CloudDocumentsList
export const LocalDocumentsList: React.FC<{
  files: FileObject[]
  listType?: LocalSettings["documentsListDisplayType"]
}> = ({ files, listType }) => (
  <>
    {files.map((file) => (
      <LocalDocumentSidebarItem
        key={file.path}
        file={file}
        listType={listType}
      />
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
    <PrimarySidebarToggleableSectionContainer>
      <LocalDocumentsList files={files} listType={listType} />
      {dirs.map((dir) => (
        <DirItem
          key={dir.path}
          dir={dir}
          listType={listType}
          // exists={"exists" in dir ? dir.exists : undefined}
        />
      ))}
    </PrimarySidebarToggleableSectionContainer>
  )
}
