import React from "react"
import styled from "styled-components/macro"

import { useDocumentsAPI, useMainState } from "../MainProvider"

export const Tag: React.FC<{ tagId: string }> = ({ children, tagId }) => {
  const { updateDocument } = useDocumentsAPI()
  const { currentDocumentId } = useMainState()

  const removeTag = async (id: string) => {
    if (currentDocumentId !== null) {
      await updateDocument(currentDocumentId, (original) => ({
        tags: original.tags.filter((tagId) => tagId !== id),
      }))
    }
  }

  return (
    <TagContainer
      title="Click to remove"
      onClick={async (e) => {
        removeTag(tagId)
      }}
    >
      {children}
    </TagContainer>
  )
}

const TagContainer = styled.div`
  cursor: pointer;
  user-select: none;

  padding: 3px 6px;
  border: 1px solid;

  font-size: 11px;

  color: var(--light-500);
  background-color: var(--dark-500);
  border-color: var(--dark-600);
  border-radius: 2px;

  :hover {
    color: var(--light-600);
    background-color: var(--dark-600);
    border-color: var(--dark-600);
  }
`
