import { useIsHovered, useToggleable } from "../../../hooks"
import { formatOptional } from "../../../utils"

import { useLocalFS } from "../../LocalFSProvider"

import { LocalDocumentSectionHeader } from "../../DocumentsList/SectionHeader"
import { LocalDocumentSidebarItem } from "../../DocumentsList/SidebarDocumentItem"

import { PrimarySidebarSectionContainer } from "../PrimarySidebar.styles"

import { FileObject, DirObjectRecursive } from "./types"

export const DirItem: React.FC<
  DirObjectRecursive & {
    // exists?: boolean
    startOpen?: boolean
  }
> = ({ path, name, files, dirs, startOpen = false }) => {
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
        <LocalDocumentsSubGroupInner dirs={dirs} files={files} />
      ) : null}
    </PrimarySidebarSectionContainer>
  ) : null
}

// TODO: remove duplication with DocumentsList
// TODO: add empty state (maybe)
export const LocalDocumentItemsList: React.FC<{ files: FileObject[] }> = ({
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

export const LocalDocumentsSubGroupInner: React.FC<{
  files: FileObject[]
  dirs: DirObjectRecursive[]
}> = ({ files, dirs }) => {
  return (
    <>
      <LocalDocumentItemsList files={files} />
      {dirs.map((dir) => (
        <DirItem
          key={dir.path}
          {...dir}
          // exists={"exists" in dir ? dir.exists : undefined}
        />
      ))}
    </>
  )
}
