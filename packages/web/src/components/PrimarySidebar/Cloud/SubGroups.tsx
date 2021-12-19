import { memo, useState } from "react"

import { GroupTreeBranch } from "../../../helpers/createGroupTree"
import { useToggleable, useRxSubscription } from "../../../hooks"

import { DocumentsList, CloudDocumentSectionHeader } from "../../DocumentsList"
import { DocumentDoc, LocalSettings, useDatabase } from "../../Database"

import {
  PrimarySidebarSectionContainer,
  PrimarySidebarToggleableSectionContainer,
} from "../PrimarySidebar.styles"

import { createFindDocumentsInGroupQuery } from "./queries"
import { useSorting } from "../../SortingProvider"

// TODO: use stateless toggleables and keep state higher up, persisting it between path changes (either as a global collection of group.ids that are open or closed, or a per-path one)

export const DocumentsListAndSubGroups: React.FC<{
  groups: GroupTreeBranch[]
  documents: DocumentDoc[]
  listType: LocalSettings["documentsListDisplayType"]
}> = memo(({ groups, documents, listType }) => (
  <PrimarySidebarToggleableSectionContainer>
    <DocumentsList documents={documents} listType={listType} />
    {groups.map((group) => (
      <SubGroupDocumentsList key={group.id} group={group} />
    ))}
  </PrimarySidebarToggleableSectionContainer>
))

export const SubGroupDocumentsList: React.FC<{
  group: GroupTreeBranch
}> = ({ group }) => {
  const db = useDatabase()
  const { sorting } = useSorting()

  const { toggle, isOpen } = useToggleable(true)

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsInGroupQuery(db, sorting, group.id)
  )

  const shouldRender = !isLoading && documents && documents.length > 0

  // TODO: "dim" all child components when the section toggler is hovered to quickly indicate which things are descendants of this branch and will be hidden

  // TODO: reduce duplication with diritem
  const [isHovered, setIsHovered] = useState(false)
  const handleMouseEnter = (e) => {
    setIsHovered(true)
  }
  const handleMouseLeave = (e) => {
    setIsHovered(false)
  }

  return shouldRender ? (
    <PrimarySidebarSectionContainer isHovered={isHovered}>
      <CloudDocumentSectionHeader
        groupId={group.id}
        onToggle={toggle}
        isOpen={isOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {group.name}
      </CloudDocumentSectionHeader>
      {isOpen ? (
        <DocumentsListAndSubGroups
          documents={documents}
          groups={group.children}
          listType="tree"
        />
      ) : null}
    </PrimarySidebarSectionContainer>
  ) : null
}
