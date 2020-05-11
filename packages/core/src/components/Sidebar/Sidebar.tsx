import React from "react"

import { LogoutButton } from "../LogoutButton"
import { ConnectWithMedium } from "../ConnectWithMedium"
import SidebarDocumentItem from "./SidebarDocumentItem"
import { SwitchEditor } from "../Main"
import { Document } from "../../models"
import styled from "styled-components/macro"

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
    <OuterContainer>
      {/* <div>
        <LogoutButton />
        <ConnectWithMedium />
      </div> */}
      <Header>Drafts</Header>
      <List>
        {documents.map((doc) => (
          <SidebarDocumentItem
            key={doc.id}
            document={doc}
            switchEditor={switchEditor}
          />
        ))}
        <div>
          {/* <button onClick={handleSaveDocument}>Save</button> */}
          <NewButton onClick={handleCreateDocument}>+ Create New</NewButton>
        </div>
      </List>
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
