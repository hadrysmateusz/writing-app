import React, { useState, useCallback } from "react"
import { DataStore } from "aws-amplify"

import { LogoutButton } from "../LogoutButton"
import { ConnectWithMedium } from "../ConnectWithMedium"
import { useAsyncEffect } from "../../hooks"
import { Document } from "../../models"
import { createDocument } from "../../helpers"

export const Sidebar: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [error, setError] = useState<string | null>(null)

  useAsyncEffect(async () => {
    try {
      const documents = await DataStore.query(Document)
      setDocuments(documents)
    } catch (error) {
      setError(error.message)
    }
  }, [])

  const handleCreateDocument = async () => {
    const title = prompt("Title") ?? ""
    createDocument({ title, content: "" })
  }

  return (
    <div>
      <div>
        <LogoutButton />
        <ConnectWithMedium />
        <button onClick={handleCreateDocument}>Create New</button>
      </div>
      <div>
        {error ??
          documents.map((doc) => <SidebarDocumentItem key={doc.id} document={doc} />)}
      </div>
    </div>
  )
}

const SidebarDocumentItem = ({ document }: { document: Document }) => {
  // const { setCurrentDocument } = useAppContext()

  const openDocument = useCallback(() => {
    // setCurrentDocument(document.documentId)
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
