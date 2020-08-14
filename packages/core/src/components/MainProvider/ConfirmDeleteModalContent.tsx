import React, { FunctionComponent, useCallback } from "react"
import styled from "styled-components/macro"

import { useModalContext } from "../Modal"
import { Button } from "../Button"
import { useDocumentsAPI, useMainState } from "."
import { ConfirmDeleteModalContext } from "./types"

const ModalContainer = styled.div`
  background: #252525;
  border: 1px solid #363636;
  padding: 20px;
  border-radius: 4px;
  color: white;
`

const Container = styled.div`
  width: 350px;
  margin-bottom: 16px;
`

export const ConfirmDeleteModalContent: FunctionComponent = () => {
  const { close, props } = useModalContext() as ConfirmDeleteModalContext
  const { findDocumentById } = useDocumentsAPI()
  const { switchDocument } = useMainState()

  const permanentlyRemoveDocument = useCallback(
    async (documentId: string) => {
      const original = await findDocumentById(documentId, true)
      if (original === null) {
        throw new Error(`no document found matching this id (${documentId})`)
      }

      try {
        await original.remove()
        switchDocument(null)
      } catch (error) {
        // TODO: better surface this error to the user
        console.warn("The document was not removed")
      }
    },
    [findDocumentById, switchDocument]
  )

  const handleConfirm = useCallback(() => {
    permanentlyRemoveDocument(props.documentId)
    close()
  }, [close, permanentlyRemoveDocument, props])

  const handleCancel = useCallback(() => {
    close()
  }, [close])

  // TODO: make the modal look good
  return (
    <ModalContainer>
      <p>Are you sure you want to delete this document permanently?</p>
      <Container>
        {/* TODO: add danger style */}
        <Button onClick={handleConfirm}>Yes. Delete it</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </Container>
    </ModalContainer>
  )
}
