import React, { useCallback } from "react"
import { DataStore } from "aws-amplify"

import { Document } from "../../models"
import styled from "styled-components"

const SidebarDocumentItem: React.FC<{
  document: Document
  switchEditor: (id: string | null) => void
}> = ({ document, switchEditor }) => {
  const removeDocument = () => {
    switchEditor(null)
    DataStore.delete(document)
  }

  const openDocument = useCallback(() => {
    switchEditor(document.id)
  }, [document.id, switchEditor])

  // const createdAt = new Date(document.createdAt).toLocaleString()
  return (
    <Container>
      <Title onClick={openDocument}>{document.title}</Title>
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

const Container = styled.div`
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