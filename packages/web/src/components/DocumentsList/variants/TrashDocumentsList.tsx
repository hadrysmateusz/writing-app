import React, { useEffect, useState } from "react"
import { Subscription } from "rxjs"

import { useDatabase, DocumentDoc } from "../../Database"

import { DocumentsList } from "../DocumentsList"

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
    <DocumentsList title="Trash" documents={documents} />
  )
}
