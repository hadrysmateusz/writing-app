import { FC, useState } from "react"

import { GroupTreeBranch } from "../../../helpers/createGroupTree"
import { useToggleable, useRxSubscription } from "../../../hooks"

import { DocumentsList, SectionHeader } from "../../DocumentsList"
import { useMainState } from "../../MainProvider"
import { useDatabase } from "../../Database"

import { createFindDocumentsInGroupQuery } from "./queries"
import { PrimarySidebarSectionContainer } from "../../DocumentsList/SectionHeaderComponent.styles"

// TODO: use stateless toggleables and keep state higher up, persisting it between path changes (either as a global collection of group.ids that are open or closed, or a per-path one)

export const SubGroups: FC<{ groups: GroupTreeBranch[] }> = ({ groups }) => (
  <>
    {groups.map((group) => (
      <SubGroupDocumentsList key={group.id} group={group} />
    ))}
  </>
)

export const SubGroupDocumentsList: FC<{
  group: GroupTreeBranch
}> = ({ group }) => {
  const db = useDatabase()
  const { sorting } = useMainState()

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
      <SectionHeader
        groupId={group.id}
        onToggle={toggle}
        isOpen={isOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {group.name}
      </SectionHeader>
      {isOpen ? (
        <>
          <DocumentsList documents={documents} />
          <SubGroups groups={group.children} />
        </>
      ) : null}
    </PrimarySidebarSectionContainer>
  ) : null
}
