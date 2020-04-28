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

const Container = styled.div`
  padding: 4px 10px;
  display: flex;
  justify-content: space-between;
`
const Title = styled.div`
  font-weight: bold;
`
const DeleteButton = styled.div`
  cursor: pointer;
  :hover {
    color: red;
    font-weight: bold;
  }
`

export default SidebarDocumentItem
