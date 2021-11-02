import React, { useEffect, useState, useMemo, FC } from "react"

import createGroupTree, {
  findInTree,
  findChildGroups,
  GroupTreeBranch,
} from "../../../helpers/createGroupTree"
import { getGroupName } from "../../../helpers/getGroupName"
import { formatOptional } from "../../../utils"

import { useMainState } from "../../MainProvider"
import { useDatabase, DocumentDoc } from "../../Database"
import { useViewState, PrimarySidebarViews, CloudViews } from "../../ViewState"

import { DocumentsList } from "../DocumentsList"

function createDocumentsQuery(db, groupId) {
  return db.documents.findNotRemoved().where("parentGroup").eq(groupId)
}

/**
 * Container displaying documents belonging to a specific group
 */
export const GroupDocumentsList: React.FC<{
  groupId: string
}> = ({ groupId }) => {
  const { groups } = useMainState()
  const { primarySidebar } = useViewState()

  const foundGroup = useMemo(() => {
    const groupTree = createGroupTree(groups)
    const foundGroup = findInTree(groupTree.children, groupId)
    if (foundGroup === null) {
      primarySidebar.switchSubview(PrimarySidebarViews.cloud, CloudViews.ALL)
      return null
    }
    return foundGroup
  }, [groupId, groups, primarySidebar])

  const childGroups = useMemo(() => {
    if (foundGroup === null) {
      return []
    }
    const childGroups = findChildGroups(foundGroup)
    return childGroups
  }, [foundGroup])

  return foundGroup ? (
    <GroupDocumentsListInternal group={foundGroup} childGroups={childGroups} />
  ) : null
}

const GroupDocumentsListInternal: FC<{
  group: GroupTreeBranch
  childGroups: GroupTreeBranch[]
}> = ({ group, childGroups }) => {
  const db = useDatabase()

  const [documents, setDocuments] = useState<DocumentDoc[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // TODO: extract most of this logic into a reusable hook
  useEffect(() => {
    const setup = async () => {
      // TODO: in-memory caching for better performnce when frequently switching between groups in one session
      // TODO: better decide when I should query the database directly and when to use (and where to store) the local documents list

      if (isLoading) {
        try {
          const newDocuments = await createDocumentsQuery(db, group.id).exec()
          setDocuments(newDocuments)
        } catch (error) {
          throw error // TODO: handle better in prod
        }
        setIsLoading(false)
      }
    }

    setup()
  }, [db, group.id, isLoading])

  useEffect(() => {
    const documentsSub = createDocumentsQuery(db, group.id).$.subscribe(
      (newDocuments) => {
        setDocuments(newDocuments)
      }
    )
    return () => {
      documentsSub.unsubscribe()
    }
  }, [db, group.id])

  // TODO: better state handling
  return !documents || !group || isLoading ? null : (
    <>
      <DocumentsList
        title={formatOptional(group.name, "Unnamed Collection")}
        documents={documents}
        groupId={group.id}
        parentGroupId={group.parentGroup}
        main
      />
      {childGroups.map((group) => (
        <SubGroupList key={group.id} groupId={group.id} />
      ))}
    </>
  )
}

const SubGroupList: React.FC<{
  groupId: string
}> = ({ groupId }) => {
  const { groups } = useMainState()
  const [documents, setDocuments] = useState<DocumentDoc[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const db = useDatabase()

  // TODO: extract most of this logic into a reusable hook
  useEffect(() => {
    const setup = async () => {
      // TODO: in-memory caching for better performnce when frequently switching between groups in one session
      // TODO: better decide when I should query the database directly and when to use (and where to store) the local documents list

      if (isLoading) {
        try {
          const newDocuments = await createDocumentsQuery(db, groupId).exec()
          setDocuments(newDocuments)
        } catch (error) {
          throw error // TODO: handle better in prod
        }
        setIsLoading(false)
      }
    }

    setup()
  }, [db, groupId, isLoading])

  useEffect(() => {
    const documentsSub = createDocumentsQuery(db, groupId).$.subscribe(
      (newDocuments) => {
        setDocuments(newDocuments)
      }
    )
    return () => {
      documentsSub.unsubscribe()
    }
  }, [db, groupId])

  const groupName = useMemo<string>(
    () => formatOptional(getGroupName(groupId, groups), "Unnamed Group"),
    [groupId, groups]
  )

  const shouldRender = !isLoading && documents && documents.length > 0

  return shouldRender ? (
    <DocumentsList title={groupName} documents={documents} groupId={groupId} />
  ) : null
}
