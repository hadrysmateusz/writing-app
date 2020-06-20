import React, { useEffect, useState } from "react"
import styled from "styled-components/macro"

import SidebarDocumentItem from "./SidebarDocumentItem"
import { useMainState } from "../MainState/MainStateProvider"
import { useDatabase, DocumentDoc } from "../Database"
import { Subscription } from "rxjs"
import createGroupTree, {
  findInTree,
  findChildGroups,
  GroupTreeBranch,
} from "../../helpers/createGroupTree"
import { formatOptional } from "../../utils"
import { useViewState } from "../View/ViewStateProvider"
import { VIEWS } from "./types"

/**
 * Base presentational component
 *
 * TODO: maybe split the actual list into a separate component
 * for more customisability in advanced views
 */
export const DocumentsList: React.FC<{
  title: string
  documents: DocumentDoc[]
}> = ({ title, documents }) => {
  return (
    <>
      <SectionHeader>
        <span>{" " + title}</span>
      </SectionHeader>
      {documents.map((document) => (
        <SidebarDocumentItem key={document.id} document={document} />
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

  return <DocumentsList title="All Documents" documents={documents} />
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
  return !documents || isLoading ? (
    <div>Loading...</div>
  ) : (
    <DocumentsList title="Trash" documents={documents} />
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
  const [documents, setDocuments] = useState<DocumentDoc[] | null>(null)
  const [group, setGroup] = useState<GroupTreeBranch | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { primarySidebar } = useViewState()

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
        const foundGroup = findInTree(groupTree, groupId)
        if (foundGroup === null) {
          // TODO: consider if other alternatives have better UX
          primarySidebar.switchView(VIEWS.ALL)
          setGroup(null)
          setIsLoading(false)
          return
        }
        setGroup(foundGroup)

        const childGroups = findChildGroups(foundGroup)
        const childGroupIds = childGroups.map((group) => group.id)
        const groupIds = [...childGroupIds, groupId]

        //         console.log(`group with id: ${groupId} has following child groups:
        // ${JSON.stringify(childGroups, null, 2)}`)

        //         console.log(`childGroup IDs:
        // ${JSON.stringify(childGroupIds, null, 2)}`)

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
  return !documents || !group || isLoading ? (
    <div>Loading...</div>
  ) : (
    <DocumentsList
      title={formatOptional(group.name, "Unnamed Collection")}
      documents={documents}
    />
  )
}

const SectionHeader = styled.div`
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
`
