import { memo } from "react"

import {
  GenericDocument_Discriminated,
  GenericDocGroupTree_Discriminated,
} from "../../../types"
import { useIsHovered, useToggleable } from "../../../hooks"

import { usePrimarySidebar } from "../../ViewState"

import {
  CloudDocumentSectionHeaderProps,
  LocalDocumentSectionHeaderProps,
} from "../SectionHeader"
import {
  PrimarySidebarToggleableSectionContainer,
  PrimarySidebarSectionContainer,
} from "../PrimarySidebar.styles"
import { SidebarDocumentItemProps } from "../SidebarDocumentItem"

type SectionHeaderComponentType = React.ComponentType<
  CloudDocumentSectionHeaderProps | LocalDocumentSectionHeaderProps
>

type DocumentItemComponentType = React.ComponentType<SidebarDocumentItemProps>

export const NestedDocumentsListSection: React.FC<{
  groupTree: GenericDocGroupTree_Discriminated

  DocumentItemComponent: DocumentItemComponentType
  SectionHeaderComponent: SectionHeaderComponentType
}> = ({ groupTree, SectionHeaderComponent, DocumentItemComponent }) => {
  // TODO: use stateless toggleables and keep state higher up, persisting it between path changes (either as a global collection of group.ids that are open or closed, or a per-path one)
  const { toggle, isOpen } = useToggleable(true)

  const { getHoverContainerProps, isHovered } = useIsHovered()

  // const shouldRender = !isLoading && documents && documents.length > 0

  return groupTree.childDocuments.length > 0 ? (
    <PrimarySidebarSectionContainer isHovered={isHovered}>
      <SectionHeaderComponent
        isOpen={isOpen}
        onToggle={toggle}
        identifier={groupTree.identifier}
        {...getHoverContainerProps()}
      >
        {groupTree.identifier !== null ? groupTree.name : "ROOT_GROUP"}
      </SectionHeaderComponent>
      {isOpen ? (
        <NestedDocumentsList
          documents={groupTree.childDocuments}
          groups={groupTree.childGroups}
          SectionHeaderComponent={SectionHeaderComponent}
          DocumentItemComponent={DocumentItemComponent}
        />
      ) : null}
    </PrimarySidebarSectionContainer>
  ) : null
}

export const FlatDocumentsList: React.FC<{
  documents: GenericDocGroupTree_Discriminated["childDocuments"]

  DocumentItemComponent: DocumentItemComponentType
}> = ({ documents, DocumentItemComponent }) => (
  <>
    {documents.map((document) => (
      <DocumentItemComponent key={document.identifier} document={document} />
    ))}
  </>
)

export const NestedDocumentsList: React.FC<{
  documents: GenericDocGroupTree_Discriminated["childDocuments"]
  groups: GenericDocGroupTree_Discriminated["childGroups"]

  DocumentItemComponent: DocumentItemComponentType
  SectionHeaderComponent: SectionHeaderComponentType
}> = ({ documents, groups, SectionHeaderComponent, DocumentItemComponent }) => (
  <PrimarySidebarToggleableSectionContainer>
    <FlatDocumentsList
      documents={documents}
      DocumentItemComponent={DocumentItemComponent}
    />
    {groups.map((childGroup) => (
      <NestedDocumentsListSection
        key={childGroup.identifier}
        groupTree={childGroup}
        SectionHeaderComponent={SectionHeaderComponent}
        DocumentItemComponent={DocumentItemComponent}
      />
    ))}
  </PrimarySidebarToggleableSectionContainer>
)

export const DocumentsList: React.FC<{
  groupTree: GenericDocGroupTree_Discriminated | null
  flatDocumentsList?: GenericDocument_Discriminated[]

  DocumentItemComponent: DocumentItemComponentType
  SectionHeaderComponent: SectionHeaderComponentType
}> = memo(
  ({
    groupTree,
    flatDocumentsList,
    SectionHeaderComponent,
    DocumentItemComponent,
  }) => {
    const { documentsListDisplayType } = usePrimarySidebar()

    if (!groupTree) {
      return null
    }

    switch (documentsListDisplayType) {
      case "flat_list":
        return (
          <FlatDocumentsList
            documents={flatDocumentsList || []}
            DocumentItemComponent={DocumentItemComponent}
          />
        )
      case "nested_list":
        return (
          <NestedDocumentsList
            documents={groupTree.childDocuments}
            groups={groupTree.childGroups}
            SectionHeaderComponent={SectionHeaderComponent}
            DocumentItemComponent={DocumentItemComponent}
          />
        )
    }
  }
)
