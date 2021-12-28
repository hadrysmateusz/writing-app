import { memo } from "react"

import { useIsHovered, useToggleable } from "../../../hooks"
import { GenericDocument_Discriminated } from "../../../types"
import { GenericDocGroupTree_Discriminated } from "../../../types/GenericDocGroup"

import { usePrimarySidebar } from "../../ViewState"
import {
  PrimarySidebarSectionContainer,
  PrimarySidebarToggleableSectionContainer,
} from "../PrimarySidebar.styles"
import { CloudDocumentSectionHeader } from "../SectionHeader"
import { CloudDocumentSidebarItem } from "../SidebarDocumentItem"

export const DocumentsList: React.FC<{
  groupTree: GenericDocGroupTree_Discriminated | null
  flatDocumentsList?: GenericDocument_Discriminated[]
}> = memo(({ groupTree, flatDocumentsList }) => {
  const { documentsListDisplayType } = usePrimarySidebar()

  if (!groupTree) {
    return null
  }

  switch (documentsListDisplayType) {
    case "flat_list":
      return <FlatDocumentsList documents={flatDocumentsList || []} />
    case "nested_list":
      return (
        <NestedDocumentsList
          documents={groupTree.childDocuments}
          groups={groupTree.childGroups}
        />
      )
    default:
      // TODO: handle this scenario better
      return (
        <NestedDocumentsList
          documents={groupTree.childDocuments}
          groups={groupTree.childGroups}
        />
      )
  }
})

export const FlatDocumentsList: React.FC<{
  documents: GenericDocGroupTree_Discriminated["childDocuments"]
}> = ({ documents }) => (
  <>
    {documents.map((document) => (
      <CloudDocumentSidebarItem key={document.identifier} document={document} />
    ))}
  </>
)

export const NestedDocumentsList: React.FC<{
  documents: GenericDocGroupTree_Discriminated["childDocuments"]
  groups: GenericDocGroupTree_Discriminated["childGroups"]
}> = ({ documents, groups }) => (
  <PrimarySidebarToggleableSectionContainer>
    <FlatDocumentsList documents={documents} />
    {groups.map((childGroup) => (
      <NestedDocumentsListSection
        key={childGroup.identifier}
        groupTree={childGroup}
      />
    ))}
  </PrimarySidebarToggleableSectionContainer>
)

export const NestedDocumentsListSection: React.FC<{
  groupTree: GenericDocGroupTree_Discriminated
}> = ({ groupTree }) => {
  // TODO: use stateless toggleables and keep state higher up, persisting it between path changes (either as a global collection of group.ids that are open or closed, or a per-path one)
  const { toggle, isOpen } = useToggleable(true)

  const { getHoverContainerProps, isHovered } = useIsHovered()

  // const shouldRender = !isLoading && documents && documents.length > 0

  return groupTree.childDocuments.length > 0 ? (
    <PrimarySidebarSectionContainer isHovered={isHovered}>
      <CloudDocumentSectionHeader
        isOpen={isOpen}
        onToggle={toggle}
        groupId={groupTree.identifier}
        {...getHoverContainerProps()}
      >
        {groupTree.identifier !== null ? groupTree.name : "ROOT_GROUP"}
      </CloudDocumentSectionHeader>
      {isOpen ? (
        <NestedDocumentsList
          documents={groupTree.childDocuments}
          groups={groupTree.childGroups}
        />
      ) : null}
    </PrimarySidebarSectionContainer>
  ) : null
}
