import { memo } from "react"

import { GroupTreeBranch } from "../../../helpers/createGroupTree"
import { useToggleable, useRxSubscription, useIsHovered } from "../../../hooks"

import { DocumentDoc, LocalSettings, useDatabase } from "../../Database"
import { useSorting } from "../../SortingProvider"

import {
  PrimarySidebarSectionContainer,
  PrimarySidebarToggleableSectionContainer,
} from "../PrimarySidebar.styles"
import { CloudDocumentSectionHeader } from "../SectionHeader"
import { CloudDocumentSidebarItem } from "../SidebarDocumentItem"

import { createFindDocumentsInGroupQuery } from "./queries"

// TODO: use stateless toggleables and keep state higher up, persisting it between path changes (either as a global collection of group.ids that are open or closed, or a per-path one)

export const SubGroupDocumentsList: React.FC<{
  group: GroupTreeBranch
}> = ({ group }) => {
  const db = useDatabase()
  const { sorting } = useSorting()

  const { toggle, isOpen } = useToggleable(true)

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsInGroupQuery(db, sorting, group.id)
  )

  const { getHoverContainerProps, isHovered } = useIsHovered()

  const shouldRender = !isLoading && documents && documents.length > 0

  return shouldRender ? (
    <PrimarySidebarSectionContainer isHovered={isHovered}>
      <CloudDocumentSectionHeader
        isOpen={isOpen}
        onToggle={toggle}
        groupId={group.id}
        {...getHoverContainerProps()}
      >
        {group.name}
      </CloudDocumentSectionHeader>
      {isOpen ? (
        <CloudDocumentsListAndSubGroups
          documents={documents}
          groups={group.children}
          listType="nested_list"
        />
      ) : null}
    </PrimarySidebarSectionContainer>
  ) : null
}

// TODO: remove duplication with LocalDocumentsList
export const CloudDocumentsList: React.FC<{
  documents: DocumentDoc[]
  listType?: LocalSettings["documentsListDisplayType"]
}> = ({ documents, listType = "nested_list" }) => {
  return (
    <>
      {documents.map((document) => (
        <CloudDocumentSidebarItem
          key={document.id}
          document={document}
          listType={listType}
        />
      ))}
    </>
  )
}

export const CloudDocumentsListAndSubGroups: React.FC<{
  groups: GroupTreeBranch[]
  documents: DocumentDoc[]
  listType: LocalSettings["documentsListDisplayType"]
}> = memo(({ groups, documents, listType }) => (
  <PrimarySidebarToggleableSectionContainer>
    <CloudDocumentsList documents={documents} listType={listType} />
    {groups.map((group) => (
      <SubGroupDocumentsList key={group.id} group={group} />
    ))}
  </PrimarySidebarToggleableSectionContainer>
))
