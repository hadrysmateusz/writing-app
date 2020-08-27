import React, { useEffect, useState, useMemo } from "react"
import { Subscription } from "rxjs"

import { useMainState } from "../MainProvider"
import { useDatabase, DocumentDoc } from "../Database"
import createGroupTree, {
  findInTree,
  findChildGroups,
  GroupTreeBranch,
} from "../../helpers/createGroupTree"
import { getGroupName } from "../../helpers/getGroupName"
import { formatOptional } from "../../utils"
import { useViewState } from "../View/ViewStateProvider"
import { VIEWS } from "../Sidebar/types"
import { DocumentsList } from "./DocumentsList"

type DocumentsSubGroup = { [key: string]: DocumentDoc[] }

/**
 * Container displaying documents belonging to a specific group
 */
export const GroupDocumentsList: React.FC<{
  groupId: string
}> = ({ groupId }) => {
  const db = useDatabase()
  const { groups, rootGroup } = useMainState()
  const { primarySidebar } = useViewState()

  const [documents, setDocuments] = useState<DocumentDoc[] | null>(null)
  const [group, setGroup] = useState<GroupTreeBranch | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // TODO: extract most of this logic into a reusable hook
  // TODO: optimize this
  // TODO: use the new apis
  useEffect(() => {
    let documentsSub: Subscription | undefined

    const setup = async () => {
      // TODO: in-memory caching for better performance when frequently switching between groups in one session
      // TODO: better decide when I should query the database directly and when to use (and where to store) the local documents list
      if (rootGroup) {
        try {
          const groupTree = createGroupTree(rootGroup, groups)
          const foundGroup = findInTree(groupTree.children, groupId)
          if (foundGroup === null) {
            primarySidebar.switchView(VIEWS.ALL)
            setGroup(null)
            setIsLoading(false)
            return
          }
          setGroup(foundGroup)

          const childGroups = findChildGroups(foundGroup)
          const childGroupIds = childGroups.map((group) => group.id)
          const groupIds = [...childGroupIds, groupId]

          const documentsQuery = db.documents
            .findNotRemoved()
            .where("parentGroup")
            .in(groupIds)

          const newDocuments = await documentsQuery.exec()
          setDocuments(newDocuments)

          documentsSub = documentsQuery.$.subscribe((newDocuments) => {
            setDocuments(newDocuments)
          })
        } catch (error) {
          // TODO: handle better in prod
          throw error
        } finally {
          setIsLoading(false)
        }
      }
    }

    setup()

    return () => {
      if (documentsSub) {
        documentsSub.unsubscribe()
      }
    }
  }, [db.documents, db.groups, groupId, groups, primarySidebar, rootGroup])

  const { rootDocs, subGroups } = useMemo<{
    rootDocs: DocumentDoc[]
    subGroups: DocumentsSubGroup
  }>(() => {
    if (!documents) {
      return { rootDocs: [], subGroups: {} }
    }

    const rootDocs: DocumentDoc[] = []
    const subGroups: DocumentsSubGroup = {}

    documents.forEach((doc) => {
      if (doc.parentGroup === null || doc.parentGroup === groupId) {
        rootDocs.push(doc)
        return
      }
      if (!(doc.parentGroup in subGroups)) {
        subGroups[doc.parentGroup] = []
      }
      subGroups[doc.parentGroup].push(doc)
    })

    return { rootDocs, subGroups }
  }, [documents, groupId])

  // TODO: better state handling
  return !documents || !group || isLoading ? null : (
    <>
      <DocumentsList
        title={formatOptional(group.name, "Unnamed Collection")}
        documents={rootDocs}
        groupId={groupId}
      />
      {Object.entries(subGroups).map(([key, val]) => (
        <SubGroupList groupId={key} documents={val} key={key} />
      ))}
    </>
  )
}

const SubGroupList: React.FC<{
  groupId: string
  documents: DocumentDoc[]
}> = ({ groupId, documents }) => {
  const { groups } = useMainState()

  const groupName = useMemo<string>(
    () => formatOptional(getGroupName(groupId, groups), "Unknown Group"),
    [groupId, groups]
  )

  return (
    <DocumentsList groupId={groupId} title={groupName} documents={documents} />
  )
}
