import React, { useState, ChangeEvent, useEffect } from "react"
import styled from "styled-components/macro"

import { LogoutButton } from "../LogoutButton"
import { ConnectWithMedium } from "../ConnectWithMedium"
import SidebarDocumentItem from "./SidebarDocumentItem"
import { DocumentDoc } from "../Database"
import { Node } from "slate"

const OUTLINE_HEADING_MAX_LENGTH = 40 // TODO: this might need to change to fit a resized sidebar

type OutlineItem = { level: number; textContent: string }

// TODO: maybe replace with an enum or something to be able to use this type with the onChange event
type MenuType = "CLOUD_DOCUMENTS" | "LOCAL_DOCUMENTS" | "AUTH" | "OUTLINE"

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
            switchEditor={switchEditor}
            newDocument={newDocument}
          />
        )
      case "LOCAL_DOCUMENTS":
        return <div>Local Documents</div>
      case "OUTLINE":
        return <OutlineSidebar editorContent={editorContent} />
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
        <option value="OUTLINE">Outline</option>
        <option value="AUTH">My Account</option>
      </HeaderSelect>
      {renderContent()}
    </OuterContainer>
  )
}

const OutlineSidebar: React.FC<{ editorContent: Node[] }> = ({
  editorContent,
}) => {
  const [outline, setOutline] = useState<OutlineItem[]>([])

  useEffect(() => {
    setOutline(() => {
      const newOutline: OutlineItem[] = []
      editorContent.forEach((node) => {
        if (node?.type.startsWith("heading_")) {
          const textContent = node?.children[0]?.text
          if (textContent !== undefined && textContent.trim() !== "") {
            console.log(node)
            const headingLevel = node.type[node.type.length - 1]
            const trimmedContent = textContent.slice(
              0,
              Math.min(textContent.length, OUTLINE_HEADING_MAX_LENGTH)
            )

            // const headingText =
            newOutline.push({
              level: headingLevel,
              textContent: trimmedContent,
            })
          }
        }
      })
      console.log(newOutline)
      return newOutline
    })
  }, [editorContent])

  return (
    <div>
      {outline.map((item) => (
        <OutlineItem level={item.level}>
          <OutlineIcon>H{item.level}</OutlineIcon>
          {item.textContent}
        </OutlineItem>
      ))}
    </div>
  )
}

const OutlineItem = styled.div<{ level: number }>`
  padding: 4px 0;
  padding-left: ${(p) => p.level * 16}px;
  color: #afb3b6;
  display: flex;
  font-size: 12px;
  align-items: center;
`

const OutlineIcon = styled.span`
  font-weight: bold;
  margin-right: 6px;
  font-size: 12px;
  color: #41474d;
`

const CloudDocumentsSidebar: React.FC<{
  documents: DocumentDoc[]
  currentDocument: DocumentDoc | null
  isCurrentModified: boolean
  switchEditor: (documentId: string | null) => void
  newDocument: (shouldSwitch?: boolean) => Promise<DocumentDoc | null>
}> = ({
  documents,
  currentDocument,
  isCurrentModified,
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
