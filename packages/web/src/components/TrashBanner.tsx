import React, { useCallback } from "react"
import styled from "styled-components/macro"
import { useDocumentsAPI } from "./MainProvider"

const TrashBanner: React.FC<{ documentId: string }> = ({ documentId }) => {
  const { restoreDocument, permanentlyRemoveDocument } = useDocumentsAPI()

  const handleRestoreDocument = useCallback(() => {
    restoreDocument(documentId)
  }, [documentId, restoreDocument])

  const handlePermanentlyRemoveDocument = useCallback(() => {
    permanentlyRemoveDocument(documentId)
  }, [documentId, permanentlyRemoveDocument])

  return (
    <TrashBannerContainer>
      <div>This document is in Trash</div>
      <button onClick={handleRestoreDocument}>Restore</button>
      <button onClick={handlePermanentlyRemoveDocument}>
        Delete permanently
      </button>
    </TrashBannerContainer>
  )
}

const TrashBannerContainer = styled.div`
  background-color: #db4141;
  height: 44px;
  width: 100%;
  color: white;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
  button {
    cursor: pointer;
    display: block;
    border: 1px solid white;
    background: transparent;
    border-radius: 2px;
    padding: 4px 14px;
    font-family: "Poppins";
    font-size: 12px;
    font-weight: 500;
    color: white;

    transition: background-color 200ms ease;

    :hover {
      background-color: #e34d4d;
    }

    :active {
      background-color: #d13b3b;
    }

    /* TODO: figure out focus / outline styles */
  }
  > * + * {
    margin-left: 12px;
  }
`

export default TrashBanner
