import React from "react"

import { LogoutButton } from "../LogoutButton"
import { ConnectWithMedium } from "../ConnectWithMedium"
import SidebarDocumentItem from "./SidebarDocumentItem"
import { SwitchEditor } from "../Main"
import { Document } from "../../models"

type SidebarProps = {
  switchEditor: SwitchEditor
  documents: Document[]
  saveDocument: () => void
  newDocument: (shouldSwitch?: boolean) => Promise<Document | null>
}

export const Sidebar: React.FC<SidebarProps> = ({
  switchEditor,
  saveDocument,
  newDocument,
  documents,
}) => {
  const handleCreateDocument = async () => {
    newDocument()
  }

  const handleSaveDocument = async () => {
    saveDocument()
  }

  return (
    <div>
      <div>
        <LogoutButton />
        <ConnectWithMedium />
      </div>
      <div>
        <button onClick={handleSaveDocument}>Save</button>
        <button onClick={handleCreateDocument}>Create New</button>
      </div>
      <div>
        {documents.map((doc) => (
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
