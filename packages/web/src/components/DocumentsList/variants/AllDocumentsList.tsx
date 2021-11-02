import React, { useEffect, useState } from "react"
import { Subscription } from "rxjs"

import { cleanUpSubscriptions } from "../../../utils"

import { DocumentDoc, useDatabase } from "../../Database"
import { useMainState } from "../../MainProvider"

import { DocumentsList } from "../DocumentsList"

/**
 * Container for displaying all not removed documents
 */
export const AllDocumentsList: React.FC = () => {
  const db = useDatabase()
  const { sorting } = useMainState()
  const [documents, setDocuments] = useState<DocumentDoc[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // TODO: extract most of this logic into a reusable hook
  useEffect(() => {
    let documentsSub: Subscription | undefined

    const setup = async () => {
      setIsLoading(true)

      try {
        // TODO: this query and this component in general replace most of the functionality of the MainProvider's documents subscription, see if it's still necessary
        // TODO: this should probably be paged
        // TODO: this should probably be cached somewhere above for better speed (but maybe not in MainProvider, it's a bit too high I think)

        /* TODO: When the title is empty, it's not included in the results of this query
        A possible solution would be to actually save documents with no title as having the title 'Untitled', or a custom string that would have special handling when displayed */
        const documentsQuery = db.documents
          .findNotRemoved()
          .sort({ [sorting.index]: sorting.direction })

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
  }, [db.documents, sorting, sorting.direction, sorting.index])

  // TODO: better state handling
  return !documents || isLoading ? null : (
    <DocumentsList title="All Documents" documents={documents} main />
  )
}
