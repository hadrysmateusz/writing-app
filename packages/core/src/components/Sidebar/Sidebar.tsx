import React, { useState, ChangeEvent } from "react"
import styled from "styled-components/macro"
import { Node } from "slate"

import { CloudDocumentsSidebarMenu } from "./CloudDocumentsSidebarMenu"
import { LogoutButton } from "../LogoutButton"
import { ConnectWithMedium } from "../ConnectWithMedium"
import { DocumentDoc } from "../Database"

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
          <CloudDocumentsSidebarMenu
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

const OuterContainer = styled.div`
  background-color: #1f2428;
  border-right: 1px solid;
  border-color: #1b1f23;
`
