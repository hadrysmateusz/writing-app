import React, { useState, ChangeEvent } from "react"
import styled from "styled-components/macro"

import { LogoutButton } from "../LogoutButton"
import { ConnectWithMedium } from "../ConnectWithMedium"
import SidebarDocumentItem from "./SidebarDocumentItem"
import { DocumentDoc } from "../Database"
import { Node } from "slate"

// TODO: maybe replace with an enum or something to be able to use this type with the onChange event
type MenuType = "CLOUD_DOCUMENTS" | "LOCAL_DOCUMENTS" | "AUTH"

export const Sidebar: React.FC<{
  documents: DocumentDoc[]
  currentDocument: DocumentDoc | null
  isCurrentModified: boolean
  editorContent: Node[]
  switchEditor: (documentId: string | null) => void
  newDocument: (shouldSwitch?: boolean) => Promise<DocumentDoc | null>
}> = ({
  documents,
  currentDocument,
  isCurrentModified,
  editorContent,
  switchEditor,
  newDocument,
}) => {
  // TODO: replace with a more constrained set of types
  const [menuType, setMenuType] = useState<string>("CLOUD_DOCUMENTS")

  const renderContent = () => {
    switch (menuType) {
      case "CLOUD_DOCUMENTS":
        return (
          <CloudDocumentsSidebar
            documents={documents}
            currentDocument={currentDocument}
            isCurrentModified={isCurrentModified}
            editorContent={editorContent}
            switchEditor={switchEditor}
            newDocument={newDocument}
          />
        )
      case "LOCAL_DOCUMENTS":
        return <div>Local Documents</div>
      case "AUTH":
        return (
          <div style={{ margin: "16px" }}>
            <LogoutButton />
            <ConnectWithMedium />
          </div>
        )
      default:
        return <div>Nothing's here</div>
    }
  }

  return (
    <OuterContainer>
      {/* TODO: replace the placeholder dropdown */}
      <HeaderSelect
        value={menuType}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setMenuType(e.target.value)
        }}
      >
        <option value="CLOUD_DOCUMENTS">Cloud</option>
        <option value="LOCAL_DOCUMENTS">Local</option>
        <option value="AUTH">My Account</option>
      </HeaderSelect>
      {renderContent()}
    </OuterContainer>
  )
}

const CloudDocumentsSidebar: React.FC<{
  documents: DocumentDoc[]
  currentDocument: DocumentDoc | null
  isCurrentModified: boolean
  editorContent: Node[]
  switchEditor: (documentId: string | null) => void
  newDocument: (shouldSwitch?: boolean) => Promise<DocumentDoc | null>
}> = ({
  documents,
  currentDocument,
  isCurrentModified,
  editorContent,
  switchEditor,
  newDocument,
}) => {
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
          />
        )
      })}
      <div>
        <NewButton onClick={handleCreateDocument}>+ Create New</NewButton>
      </div>
    </List>
  )
}

const HeaderSelect = styled.select`
  color: white;
  width: calc(100% - 16px);
  outline: none;
  padding: 13px 16px;
  font-family: "Poppins";
  font-weight: 600;
  font-size: 15px;
  line-height: 19px;
  letter-spacing: 0.03em;
  background: none;
  border: none;
  > * {
    color: black;
    font-size: 14px;
  }
`

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

const OuterContainer = styled.div`
  background-color: #1f2428;
  border-right: 1px solid;
  border-color: #1b1f23;
`
