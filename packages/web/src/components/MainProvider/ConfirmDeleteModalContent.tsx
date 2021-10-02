import { FC } from "react"
import styled from "styled-components/macro"

import { Button } from "../Button"
import { useDocumentsAPI } from "."
import { ConfirmDeleteModalProps } from "./types"
import { CloseModalFn } from "../Modal/types"

const ModalContainer = styled.div`
  background: #252525;
  border: 1px solid #363636;
  padding: 4px 20px 0;
  border-radius: 4px;
  color: white;
`

const Container = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 16px;
`

export type ConfirmDeleteModalReturnValue = boolean

export const ConfirmDeleteModalContent: FC<
  ConfirmDeleteModalProps & {
    close: CloseModalFn<ConfirmDeleteModalReturnValue>
  }
> = ({ documentId, close }) => {
  const { findDocumentById } = useDocumentsAPI()

  const permanentlyRemoveDocument = async (documentId: string) => {
    const original = await findDocumentById(documentId, true)
    if (original === null) {
      throw new Error(`no document found matching this id (${documentId})`)
    }

    try {
      await original.remove()
    } catch (error) {
      // TODO: better surface this error to the user
      console.error("The document was not removed")
    }
  }

  const handleConfirm = () => {
    if (documentId) {
      permanentlyRemoveDocument(documentId)
    } else {
      // TODO: better error handling
      console.error("Missing documentId")
    }
    return close(true)
  }

  const handleCancel = () => close(false)

  // TODO: make the modal look good
  return (
    <ModalContainer>
      <p>Are you sure you want to delete this document permanently?</p>
      <Container>
        {/* TODO: add danger style */}
        <Button onClick={handleConfirm} variant={"danger"}>
          Yes. Delete it
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </Container>
    </ModalContainer>
  )
}
