import React, { useEffect, useState, useMemo } from "react"
import styled from "styled-components/macro"

import SidebarDocumentItem from "./SidebarDocumentItem"
import { useMainState } from "../MainProvider"
import { useDatabase, DocumentDoc } from "../Database"
import { Subscription } from "rxjs"
import createGroupTree, {
  findInTree,
  findChildGroups,
  GroupTreeBranch,
} from "../../helpers/createGroupTree"
import { getGroupName } from "../../helpers/getGroupName"
import { formatOptional } from "../../utils"
import { useViewState } from "../View/ViewStateProvider"
import { VIEWS } from "./types"
import { useDocumentsAPI } from "../MainProvider"
import { ContextMenuItem, useContextMenu } from "../ContextMenu"

type DocumentsSubGroup = { [key: string]: DocumentDoc[] }

/**
 * Base presentational component
 */
export const DocumentsList: React.FC<{
  title: string
  documents: DocumentDoc[]
  group?: GroupTreeBranch
  flat?: boolean
}> = ({ title, documents, group, flat = false }) => {
  const { rootDocs, subGroups } = useMemo<{
    rootDocs: DocumentDoc[]
    subGroups: DocumentsSubGroup
  }>(() => {
    if (flat || group === undefined) {
      return { rootDocs: documents, subGroups: {} }
    }

    const rootDocs: DocumentDoc[] = []
    const subGroups: DocumentsSubGroup = {}

    documents.forEach((doc) => {
      if (doc.parentGroup === null || doc.parentGroup === group.id) {
        rootDocs.push(doc)
        return
      }
      if (!(doc.parentGroup in subGroups)) {
        subGroups[doc.parentGroup] = []
      }
      subGroups[doc.parentGroup].push(doc)
    })

    return { rootDocs, subGroups }
  }, [documents, flat, group])

  return (
    <>
      <SectionHeader groupId={group?.id}>{title}</SectionHeader>
      <DocumentsListDumb groupId={group?.id} documents={rootDocs} />
      {Object.entries(subGroups).map(([key, val]) => (
        <DocumentsSubList groupId={key} documents={val} />
      ))}
    </>
  )
}

const DocumentsSubList: React.FC<{
  groupId: string
  documents: DocumentDoc[]
}> = ({ groupId, documents }) => {
  const { groups } = useMainState()

  const groupName = useMemo(() => getGroupName(groupId, groups), [
    groupId,
    groups,
  ])

  return (
    <>
      <SectionHeader groupId={groupId}>{groupName}</SectionHeader>
      <DocumentsListDumb
        groupId={groupId}
        documents={documents}
        key={groupId}
      />
    </>
  )
}

const DocumentsListDumb: React.FC<{
  groupId?: string
  documents: DocumentDoc[]
}> = ({ groupId, documents }) => {
  return documents.length === 0 ? (
    <Empty>Empty</Empty>
  ) : (
    <>
      {documents.map((document) => (
        <SidebarDocumentItem
          key={document.id}
          document={document}
          groupId={groupId}
        />
      ))}
    </>
  )
}

/**
 * Container displaying all documents
 */
export const AllDocumentsList: React.FC<{}> = () => {
  // TODO: probably should replace with a paged query to the database
  const { documents } = useMainState()

  return <DocumentsList title="All Documents" documents={documents} flat />
}

/**
 * Container for displaying documents in the inbox (root)
 */
export const InboxDocumentsList: React.FC = () => {
  const { findDocuments } = useDocumentsAPI()
  const [documents, setDocuments] = useState<DocumentDoc[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let documentsSub: Subscription | undefined

    const setup = async () => {
      const documentsQuery = findDocuments().where("parentGroup").eq(null)

      const newDocuments = await documentsQuery.exec()
      setDocuments(newDocuments)
      setIsLoading(false)

      documentsSub = documentsQuery.$.subscribe((newDocuments) => {
        setDocuments(newDocuments)
      })
    }

    setup()

    return () => {
      if (documentsSub) {
        documentsSub.unsubscribe()
      }
    }
  }, [findDocuments])

  // TODO: better state handling
  return !documents || isLoading ? null : (
    <DocumentsList title="Inbox" documents={documents} />
  )
}

/**
 * Container displaying documents belonging to a specific group
 */
export const TrashDocumentsList: React.FC = () => {
  const db = useDatabase()
  const [documents, setDocuments] = useState<DocumentDoc[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // TODO: extract most of this logic into a reusable hook
  useEffect(() => {
    // let groupSub: Subscription | undefined
    let documentsSub: Subscription | undefined

    const setup = async () => {
      // TODO: in-memory caching for better performnce when frequently switching between groups in one session
      // TODO: better decide when I should query the database directly and when to use (and where to store) the local documents list

      setIsLoading(true)

      try {
        // TODO: consider creating a findRemoved static method to abstract this
        const documentsQuery = db.documents.find().where("isDeleted").eq(true)

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

    setup()

    return () => {
      if (documentsSub) {
        documentsSub.unsubscribe()
      }
    }
  }, [db.documents, db.groups])

  // TODO: better state handling
  return !documents || isLoading ? null : (
    <DocumentsList title="Trash" documents={documents} flat />
  )
}

/**
 * Container displaying documents belonging to a specific group
 */
export const DocumentsGroupList: React.FC<{
  groupId: string
}> = ({ groupId }) => {
  const db = useDatabase()
  const { groups } = useMainState()
  const { primarySidebar } = useViewState()

  const [documents, setDocuments] = useState<DocumentDoc[] | null>(null)
  const [group, setGroup] = useState<GroupTreeBranch | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // TODO: extract most of this logic into a reusable hook
  // TODO: use the new apis
  useEffect(() => {
    let documentsSub: Subscription | undefined

    const setup = async () => {
      // TODO: in-memory caching for better performnce when frequently switching between groups in one session
      // TODO: better decide when I should query the database directly and when to use (and where to store) the local documents list

      setIsLoading(true)

      try {
        const groupTree = createGroupTree(groups)
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

    setup()

    return () => {
      if (documentsSub) {
        documentsSub.unsubscribe()
      }
    }
  }, [db.documents, db.groups, groupId, groups, primarySidebar])

  // TODO: better state handling
  return !documents || !group || isLoading ? null : (
    <DocumentsList
      title={formatOptional(group.name, "Unnamed Collection")}
      documents={documents}
      group={group}
    />
  )
}

const SectionHeader: React.FC<{ groupId?: string }> = ({
  groupId,
  children,
}) => {
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()

  const { createDocument } = useDocumentsAPI()

  const handleNewDocument = () => {
    if (groupId !== undefined) {
      createDocument(groupId)
    }
    closeMenu()
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (groupId === undefined) return
    openMenu(e)
  }

  return (
    <>
      <SectionHeaderContainer onContextMenu={handleContextMenu}>
        {children}
      </SectionHeaderContainer>
      {isMenuOpen && (
        <ContextMenu>
          <ContextMenuItem onClick={handleNewDocument}>
            New Document
          </ContextMenuItem>
        </ContextMenu>
      )}
    </>
  )
}

const Empty = styled.div`
  text-align: center;
  padding: 20px;
  color: #aaa;
  user-select: none;
  font-size: 11px;
  font-weight: 500;
  :not(:last-child) {
    border-bottom: 1px solid;
    border-color: #383838;
  }
`

const SectionHeaderContainer = styled.div`
  font-family: Poppins;
  font-weight: bold;
  font-size: 10px;
  user-select: none;

  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 8px 20px;
  border-bottom: 1px solid;
  border-color: #383838;
  color: #a3a3a3;
  background: #1c1c1c;
`
