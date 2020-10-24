import React, { useEffect, useState } from "react"
import { Subscription } from "rxjs"

import { DocumentDoc } from "../../Database"
import { useDocumentsAPI } from "../../MainProvider"

import { DocumentsList } from "../DocumentsList"
import { cleanUpSubscriptions } from "../../../utils"

/**
 * Container for displaying documents in the inbox (root)
 */
export const InboxDocumentsList: React.FC = () => {
  const { findDocuments } = useDocumentsAPI()
  const [documents, setDocuments] = useState<DocumentDoc[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // TODO: extract most of this logic into a reusable hook
  useEffect(() => {
    let documentsSub: Subscription | undefined

    const setup = async () => {
      setIsLoading(true)

      try {
        const documentsQuery = findDocuments(false)
          .where("parentGroup")
          .eq(null)

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
  }, [findDocuments])

  // TODO: better state handling
  return !documents || isLoading ? null : (
    <DocumentsList title="Inbox" documents={documents} />
  )
}
