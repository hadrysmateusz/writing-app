import React, { useCallback } from "react"
// import { DataStore } from "aws-amplify"
import styled from "styled-components"

import { DocumentDoc } from "../Database"

const SidebarDocumentItem: React.FC<{
  document: DocumentDoc
  isCurrent: boolean
  isModified: boolean
  switchEditor: (id: string | null) => void
}> = ({ document, switchEditor, isCurrent, isModified }) => {
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
      <Title onClick={openDocument}>
        {title} {isModified && " *"}
      </Title>
      <DeleteButton onClick={removeDocument}>X</DeleteButton>
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
  display: flex;
  align-items: center;
  :hover ${DeleteButton} {
    opacity: 1;
  }
`
const Title = styled.div`
  cursor: pointer;
  color: #fbfbfb;
  flex: 1;
`

export default SidebarDocumentItem
