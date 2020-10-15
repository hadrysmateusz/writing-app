import React, { useEffect, useState } from "react"
import { Subscription } from "rxjs"

import { DocumentDoc } from "../../Database"
import { useDocumentsAPI } from "../../MainProvider"

import { DocumentsList } from "../DocumentsList"

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
