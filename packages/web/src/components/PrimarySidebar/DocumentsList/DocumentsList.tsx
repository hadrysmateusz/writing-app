import { memo, useCallback, useMemo } from "react"

import {
  GenericDocument_Discriminated,
  GenericDocGroupTree_Discriminated,
  GenericDocGroupTreeBranch,
} from "../../../types"
import { useIsHovered } from "../../../hooks"

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

const useDocumentSectionToggleable = (identifier: string) => {
  const { toggleSection, collapsedIdentifiers } = usePrimarySidebar()

  const isOpen = useMemo(
    () => !collapsedIdentifiers.includes(identifier),
    [collapsedIdentifiers, identifier]
  )

  const toggle = useCallback(() => {
    toggleSection(identifier)
  }, [identifier, toggleSection])

  return useMemo(() => ({ isOpen, toggle }), [isOpen, toggle])
}

export const NestedDocumentsListSection: React.FC<{
  groupTree: GenericDocGroupTreeBranch

  DocumentItemComponent: DocumentItemComponentType
  SectionHeaderComponent: SectionHeaderComponentType
}> = ({ groupTree, SectionHeaderComponent, DocumentItemComponent }) => {
  const { toggle, isOpen } = useDocumentSectionToggleable(groupTree.identifier)

  const { getHoverContainerProps, isHovered } = useIsHovered()

  // const shouldRender = !isLoading && documents && documents.length > 0

  return groupTree.childDocuments.length > 0 ||
    groupTree.childGroups.length > 0 ? (
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
}> = ({ documents, groups, SectionHeaderComponent, DocumentItemComponent }) => {
  return (
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
}

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
