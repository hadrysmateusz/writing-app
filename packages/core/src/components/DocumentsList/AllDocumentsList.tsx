import React from "react"

import { useMainState } from "../MainProvider"
import { DocumentsList } from "./DocumentsList"

/**
 * Container displaying all documents
 */
export const AllDocumentsList: React.FC<{}> = () => {
  // TODO: probably should replace with a paged query to the database
  const { documents } = useMainState()

  return <DocumentsList title="All Documents" documents={documents} />
}
