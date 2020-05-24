import React from "react"
import styled from "styled-components/macro"
import { Node } from "slate"

import SidebarDocumentItem from "./SidebarDocumentItem"
import { DocumentDoc } from "../Database"

export const CloudDocumentsSidebarMenu: React.FC<{
  documents: DocumentDoc[]
  currentDocument: DocumentDoc | null
  editorContent: Node[]
  isCurrentModified: boolean
  renameDocument: (
    documentId: string,
    title: string
  ) => Promise<Document | null>
  switchEditor: (documentId: string | null) => void
  newDocument: (shouldSwitch?: boolean) => Promise<DocumentDoc | null>
}> = ({
  documents,
  currentDocument,
  isCurrentModified,
  editorContent,
  renameDocument,
  switchEditor,
  newDocument,
}) => {
  // TODO: hovering toolbar and dev-tools are also using portals but from a different library - these should be unified

  const handleCreateDocument = async () => {
    newDocument()
  }

  return (
    <List>
      {documents.map((doc) => {
        const isCurrent = !!currentDocument && currentDocument.id === doc.id
        const isModified = isCurrent && isCurrentModified
        return (
          <SidebarDocumentItem
            key={doc.id}
            document={doc}
            editorContent={editorContent}
            isCurrent={isCurrent}
            isModified={isModified}
            switchEditor={switchEditor}
            renameDocument={renameDocument}
          />
        )
      })}
      <div>
        <NewButton onClick={handleCreateDocument}>+ Create New</NewButton>
      </div>
    </List>
  )
}

const List = styled.div`
  padding: 0 16px;
  font-size: 12px;
`

const NewButton = styled.div`
  user-select: none;
  background: none;
  border: none;
  padding: 6px 0;
  display: block;
  cursor: pointer;
  color: #676c72;
  :hover {
    color: #afb3b6;
  }
`
