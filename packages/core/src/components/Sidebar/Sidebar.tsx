import React, { useState, useCallback } from "react"
import { API } from "aws-amplify"

import { LogoutButton } from "../LogoutButton"
import { ConnectWithMedium } from "../ConnectWithMedium"
import { useAsyncEffect } from "../../hooks"
import { Document } from "../../types"
import { useAppContext } from "../../utils"

export const Sidebar: React.FC = () => {
  // TODO: replace any type with the proper document object interface
  const [documents, setDocuments] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useAsyncEffect(async () => {
    // TODO: handle unauthenticated calls
    try {
      // TODO: check if an error is thrown instead of returned when the status of response is 4xx or 5xx
      const { data, error } = await API.get("documents", "/documents", undefined)
      if (error) {
        setError(error)
        return
      }

      setDocuments(data)
      console.log(data)
    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }, [])

  return (
    <div>
      <div>
        <LogoutButton />
        <ConnectWithMedium />
      </div>
      <div>
        {error ??
          documents.map((doc) => (
            <SidebarDocumentItem key={doc.documentId} document={doc} />
          ))}
      </div>
    </div>
  )
}

const SidebarDocumentItem = ({ document }: { document: Document }) => {
  const { setCurrentDocument } = useAppContext()

  const openDocument = useCallback(() => {
    setCurrentDocument(document.documentId)
  }, [])

  // const createdAt = new Date(document.createdAt).toLocaleString()
  return (
    <div onClick={openDocument}>
      <div>
        <b>{document.title}</b>
      </div>
      {/* <p>created: <b>{createdAt}</b></p> */}
    </div>
  )
}
