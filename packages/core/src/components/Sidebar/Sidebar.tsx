import React from "react"
import { Node } from "slate"

import { LogoutButton } from "../LogoutButton"
import { ConnectWithMedium } from "../ConnectWithMedium"
import SidebarDocumentItem from "./SidebarDocumentItem"
import { SwitchEditor, CreateDocumentType } from "../Main"
import { Document } from "../../models"

export const Sidebar: React.FC<{
  switchEditor: SwitchEditor
  documents: Document[]
  saveDocument: () => void
  createDocument: (doc: CreateDocumentType) => void
}> = ({ switchEditor, saveDocument, createDocument, documents }) => {
  const handleCreateDocument = async () => {
    const title = prompt("Title") ?? ""
    createDocument({ title, content: "" })
  }

  const handleSaveDocument = async () => {
    saveDocument()
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
        {documents.map((doc) => (
          <SidebarDocumentItem key={doc.id} document={doc} switchEditor={switchEditor} />
        ))}
      </div>
    </div>
  )
}
