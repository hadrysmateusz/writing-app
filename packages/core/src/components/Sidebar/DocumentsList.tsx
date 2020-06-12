import React, { useEffect, useState } from "react"
import styled from "styled-components/macro"

import SidebarDocumentItem from "./SidebarDocumentItem"
import { useMainState } from "../MainStateProvider"
import { useDatabase, GroupDoc, DocumentDoc } from "../Database"
import { Subscription } from "rxjs"

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
    <div>
      <SectionHeader>
        <span>{" " + title}</span>
      </SectionHeader>
      {documents.map((document) => (
        <SidebarDocumentItem key={document.id} document={document} />
      ))}
    </div>
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
export const DocumentsGroupList: React.FC<{
  groupId: string
}> = ({ groupId }) => {
  const db = useDatabase()
  const [documents, setDocuments] = useState<DocumentDoc[] | null>(null)
  const [group, setGroup] = useState<GroupDoc | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // TODO: extract most of this logic into a reusable hook
  useEffect(() => {
    let groupSub: Subscription | undefined
    let documentsSub: Subscription | undefined

    const setup = async () => {
      // TODO: caching
      // TODO: better decide when I should query the database directly and when to use (and where to store) the local documents list

      setIsLoading(true)

      try {
        const groupQuery = db.groups.findOne().where("id").eq(groupId)
        const documentsQuery = db.documents
          .find()
          .where("parentGroup")
          .eq(groupId)

        const newGroup = await groupQuery.exec()
        setGroup(newGroup)

        if (!newGroup) {
          throw new Error(`Couldn't find group with id: ${groupId}`)
        }

        const newDocuments = await documentsQuery.exec()
        setDocuments(newDocuments)

        // set up subscriptions

        groupSub = groupQuery.$.subscribe((newGroup) => {
          setGroup(newGroup)
        })

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
      if (groupSub) {
        groupSub.unsubscribe()
      }
      if (documentsSub) {
        documentsSub.unsubscribe()
      }
    }
  }, [db.documents, db.groups, groupId])

  // TODO: better state handling
  return !documents || !group || isLoading ? (
    <div>Loading...</div>
  ) : (
    <DocumentsList
      title={group.name.trim() === "" ? "Unnamed Collection" : group.name}
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
