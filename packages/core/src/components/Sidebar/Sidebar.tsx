import React, { useState, useCallback, useEffect } from "react"
import { DataStore, Predicates } from "aws-amplify"
import { Node } from "slate"

import { LogoutButton } from "../LogoutButton"
import { ConnectWithMedium } from "../ConnectWithMedium"
import { Document } from "../../models"
import { createDocument } from "../../helpers"
import SidebarDocumentItem from "./SidebarDocumentItem"
import { serialize } from "../Editor/serialization"
import { SwitchEditor } from "../Main"

export const Sidebar: React.FC<{
  switchEditor: SwitchEditor
  currentEditor: string | null
  currentContent: Node[]
}> = ({ switchEditor, currentEditor, currentContent }) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDocuments()
    DataStore.observe(Document).subscribe(loadDocuments)
  })

  const handleCreateDocument = async () => {
    const title = prompt("Title") ?? ""
    createDocument({ title, content: "" })
  }

  const handleSaveDocument = async () => {
    try {
      if (currentEditor === null) {
        throw new Error("no editor is currently selected")
      }

      const original = documents.find((doc) => doc.id === currentEditor)

      if (original === undefined) {
        throw new Error("no document found matching current editor id")
      }

      const serializedContent = serialize(currentContent)

      const updatedDocument = await DataStore.save(
        Document.copyOf(original, (updated) => {
          updated.content = serializedContent
        })
      )

      console.log(updatedDocument)
    } catch (error) {
      const msgBase = "Can't save the current document"
      console.error(`${msgBase}: ${error.message}`)
      setError(msgBase)
    }
  }

  const loadDocuments = async () => {
    try {
      // TODO: This could be optimized by manually modifying state based on the subscription message type and content
      const documents = await DataStore.query(Document, Predicates.ALL)
      setDocuments(documents)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div>
      <div>
        <LogoutButton />
        <ConnectWithMedium />
        <button onClick={handleCreateDocument}>Create New</button>
        <button onClick={handleSaveDocument}>Save</button>
      </div>
      <div>
        {error ??
          documents.map((doc) => (
            <SidebarDocumentItem
              key={doc.id}
              document={doc}
              switchEditor={switchEditor}
            />
          ))}
      </div>
    </div>
  )
}
