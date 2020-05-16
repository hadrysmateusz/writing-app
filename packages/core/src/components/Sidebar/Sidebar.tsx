import React from "react"
import styled from "styled-components/macro"

import { LogoutButton } from "../LogoutButton"
import { ConnectWithMedium } from "../ConnectWithMedium"
import SidebarDocumentItem from "./SidebarDocumentItem"
import { DocumentDoc } from "../Database"

type SidebarProps = {
  documents: DocumentDoc[]
  currentDocument: DocumentDoc | null
  switchEditor: (documentId: string | null) => void
  newDocument: (shouldSwitch?: boolean) => Promise<DocumentDoc | null>
  isCurrentModified: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({
  documents,
  currentDocument,
  switchEditor,
  newDocument,
  isCurrentModified,
}) => {
  const handleCreateDocument = async () => {
    newDocument()
  }

  return (
    <OuterContainer>
      <Header>Drafts</Header>
      <List>
        {documents.map((doc) => {
          const isCurrent = !!currentDocument && currentDocument.id === doc.id
          const isModified = isCurrent && isCurrentModified

          return (
            <SidebarDocumentItem
              key={doc.id}
              document={doc}
              switchEditor={switchEditor}
              isCurrent={isCurrent}
              isModified={isModified}
            />
          )
        })}
        <div>
          <NewButton onClick={handleCreateDocument}>+ Create New</NewButton>
        </div>
      </List>
      <div style={{ margin: "16px" }}>
        <LogoutButton />
        <ConnectWithMedium />
      </div>
    </OuterContainer>
  )
}

const Header = styled.div`
  padding: 13px 16px;
  font-family: "Poppins";
  font-weight: 600;
  font-size: 15px;
  line-height: 19px;
  letter-spacing: 0.03em;
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
