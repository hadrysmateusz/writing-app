import React, { useCallback } from "react"
import styled from "styled-components/macro"

import { useDocumentsAPI } from "../MainProvider"

export const Container = styled.div`
  min-height: 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr min-content;
`

export const InnerContainer = styled.div`
  overflow-y: auto;
`

const NewButtonStyled = styled.div`
  font-family: poppins;
  font-weight: 500;
  font-size: 13px;
  color: #e4e4e4;
  background: #1e1e1e;
  user-select: none;
  border-top: 1px solid #363636;
  width: 100%;
  padding: 12px 20px;
  display: block;
  cursor: pointer;
  :hover {
    color: white;
  }
`

export const NewButton: React.FC<{ groupId: string | null }> = ({
  groupId = null,
}) => {
  const { createDocument } = useDocumentsAPI()

  const handleNew = useCallback(() => {
    createDocument(groupId)
  }, [createDocument, groupId])

  return <NewButtonStyled onClick={handleNew}>+ Create New</NewButtonStyled>
}
