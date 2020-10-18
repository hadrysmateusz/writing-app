import React, { useCallback } from "react"
import styled from "styled-components/macro"

import { useDocumentsAPI } from "../MainProvider"
import Icon from "../Icon"

export const NewButton: React.FC<{ groupId: string | null }> = ({
  groupId = null,
}) => {
  const { createDocument } = useDocumentsAPI()

  const handleNew = useCallback(() => {
    createDocument(groupId)
  }, [createDocument, groupId])

  return (
    <NewButtonSC onClick={handleNew}>
      <Icon icon="plus" color="#858585" style={{ fontSize: "1.5em" }} />
      <div>New Document</div>
    </NewButtonSC>
  )
}

const NewButtonSC = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  width: 100%;
  padding: 18px 20px 16px;

  user-select: none;
  cursor: pointer;

  font: 500 13px poppins;
  background: var(--bg-highlight);
  color: #e4e4e4;

  :hover {
    color: white;
  }
`
