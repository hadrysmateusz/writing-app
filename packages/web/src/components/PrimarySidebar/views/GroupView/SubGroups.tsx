import { FC } from "react"

import { GroupTreeBranch } from "../../../../helpers/createGroupTree"
import useRxSubscription from "../../../../hooks/useRxSubscription"

import { DocumentsList } from "../../../DocumentsList"
import { useDatabase } from "../../../Database"
import SectionHeader from "../../../DocumentsList/SectionHeader"
import { createFindDocumentsInGroupQuery } from "./helpers"
import { useToggleable } from "../../../../hooks"

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

  const { toggle, isOpen } = useToggleable(true)

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsInGroupQuery(db, group.id)
  )

  const shouldRender = !isLoading && documents && documents.length > 0

  return shouldRender ? (
    <>
      <SectionHeader groupId={group.id} onToggle={toggle} isOpen={isOpen}>
        {group.name}
      </SectionHeader>
      {isOpen ? (
        <>
          <DocumentsList documents={documents} groupId={group.id} />
          <SubGroups groups={group.children} />
        </>
      ) : null}
    </>
  ) : null
}
