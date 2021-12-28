import { FileObject, DirObjectRecursive } from "shared"

import { useIsHovered, useToggleable } from "../../../hooks"

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
}> = ({ dir, startOpen = false }) => {
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
        <LocalDocumentsSubGroupInner dirs={dir.dirs} files={dir.files} />
      ) : null}
    </PrimarySidebarSectionContainer>
  ) : null
}

// TODO: remove duplication with CloudDocumentsList
export const LocalDocumentsList: React.FC<{
  files: FileObject[]
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
}> = ({ files, dirs }) => {
  return (
    <PrimarySidebarToggleableSectionContainer>
      <LocalDocumentsList files={files} />
      {dirs.map((dir) => (
        <DirItem
          key={dir.path}
          dir={dir}
          // exists={"exists" in dir ? dir.exists : undefined}
        />
      ))}
    </PrimarySidebarToggleableSectionContainer>
  )
}
