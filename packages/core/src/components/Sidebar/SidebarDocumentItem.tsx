import React, { useCallback } from "react"
import styled from "styled-components"
import { Node } from "slate"

import { Outline } from "./Outline"
import { DocumentDoc } from "../Database"

const SidebarDocumentItem: React.FC<{
  document: DocumentDoc
  isCurrent: boolean
  isModified: boolean
  editorContent: Node[]
  switchEditor: (id: string | null) => void
}> = ({ document, switchEditor, isCurrent, isModified, editorContent }) => {
  const removeDocument = () => {
    document.remove()
    if (isCurrent) {
      switchEditor(null)
    }
  }

  const openDocument = useCallback(() => {
    switchEditor(document.id)
  }, [document.id, switchEditor])

  const title = document.title.trim() === "" ? "Untitled" : document.title

  return (
    <Container isCurrent={isCurrent}>
      <MainContainer>
        <Title onClick={openDocument}>
          {title} {isModified && " *"}
        </Title>
        <DeleteButton onClick={removeDocument}>X</DeleteButton>
      </MainContainer>
      {isCurrent && <Outline editorContent={editorContent} />}
    </Container>
  )
}

const DeleteButton = styled.div`
  cursor: pointer;
  opacity: 0;
  font-size: 11px;
  color: #afb3b6;
  padding: 8px;
  margin-right: -8px;
  :hover {
    color: white;
    font-weight: bold;
  }
`

const Container = styled.div<{ isCurrent: boolean }>`
  ${(p) => p.isCurrent && `font-weight: bold;`}
  padding: 3px 0;

  :hover ${DeleteButton} {
    opacity: 1;
  }
`

const MainContainer = styled.div`
  display: flex;
  align-items: center;
`

const Title = styled.div`
  cursor: pointer;
  color: #fbfbfb;
  flex: 1;
`

export default SidebarDocumentItem
