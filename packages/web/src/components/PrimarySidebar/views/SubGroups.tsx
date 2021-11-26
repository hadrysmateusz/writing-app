import { FC } from "react"

import { GroupTreeBranch } from "../../../helpers/createGroupTree"
import { useToggleable, useRxSubscription } from "../../../hooks"

import { DocumentsList, SectionHeader } from "../../DocumentsList"
import { useMainState } from "../../MainProvider"
import { useDatabase } from "../../Database"

import { createFindDocumentsInGroupQuery } from "./queries"

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

  return shouldRender ? (
    <>
      <SectionHeader groupId={group.id} onToggle={toggle} isOpen={isOpen}>
        {group.name}
      </SectionHeader>
      {isOpen ? (
        <>
          <DocumentsList documents={documents} />
          <SubGroups groups={group.children} />
        </>
      ) : null}
    </>
  ) : null
}
