import React, { useEffect, useState } from "react"
import { Subscription } from "rxjs"

import { cleanUpSubscriptions } from "../../../utils"

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
    let documentsSub: Subscription | undefined

    const setup = async () => {
      setIsLoading(true)

      try {
        const documentsQuery = db.documents.find().where("isDeleted").eq(true)

        const newDocuments = await documentsQuery.exec()

        setDocuments(newDocuments)

        documentsSub = documentsQuery.$.subscribe((newDocuments) => {
          setDocuments(newDocuments)
        })
      } catch (error) {
        throw error // TODO: handle better in prod
      } finally {
        setIsLoading(false)
      }
    }

    setup()

    return () => cleanUpSubscriptions([documentsSub])
  }, [db.documents])

  // TODO: better state handling
  return !documents || isLoading ? null : (
    <DocumentsList title="Trash" documents={documents} main />
  )
}
