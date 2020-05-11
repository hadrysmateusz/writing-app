import React, { useCallback } from "react"
import { DataStore } from "aws-amplify"

import { Document } from "../../models"
import styled from "styled-components"
import { SwitchEditor } from "../Main"

const SidebarDocumentItem: React.FC<{
  document: Document
  switchEditor: SwitchEditor
}> = ({ document, switchEditor }) => {
  const removeDocument = () => DataStore.delete(document)

  const openDocument = useCallback(() => {
    switchEditor(document.id)
  }, [])

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
  padding: 5px;
  margin-right: -5px;
  :hover {
    color: white;
    font-weight: bold;
  }
`

const Container = styled.div`
  padding: 4px 0;
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
