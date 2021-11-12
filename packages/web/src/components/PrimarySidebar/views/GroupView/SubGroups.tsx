import { FC } from "react"

import { GroupTreeBranch } from "../../../../helpers/createGroupTree"
import useRxSubscription from "../../../../hooks/useRxSubscription"

import { DocumentsList } from "../../../DocumentsList"
import { useDatabase } from "../../../Database"
import SectionHeader from "../../../DocumentsList/SectionHeader"
import { createFindDocumentsInGroupQuery } from "./helpers"

export const SubGroups: FC<{ groups: GroupTreeBranch[] }> = ({ groups }) => (
  <>
    {groups.map((group) => (
      <SubGroupDocumentsList
        key={group.id}
        groupId={group.id}
        groupName={group.name}
      />
    ))}
  </>
)

export const SubGroupDocumentsList: FC<{
  groupId: string
  groupName: string
}> = ({ groupId, groupName }) => {
  const db = useDatabase()

  console.log(groupName, groupId)

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsInGroupQuery(db, groupId)
  )

  const shouldRender = !isLoading && documents && documents.length > 0

  return shouldRender ? (
    <>
      <SectionHeader groupId={groupId}>{groupName}</SectionHeader>
      <DocumentsList documents={documents} groupId={groupId} />
    </>
  ) : null
}
