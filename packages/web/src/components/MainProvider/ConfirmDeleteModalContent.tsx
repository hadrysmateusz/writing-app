import { FC } from "react"
import styled from "styled-components/macro"

import { Button } from "../Button"
import { useDocumentsAPI } from "."
import { ConfirmDeleteModalProps } from "./types"
import { CloseModalFn } from "../Modal/types"
import { useDatabase } from "../Database"

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
> = ({ close, children, ...options }) => {
  const { actuallyPermanentlyRemoveDocument } = useDocumentsAPI()
  const db = useDatabase()

  // TODO: add loading state, especially important when deleting all
  const handleConfirm = async () => {
    if (options.all) {
      const documentsInTrash = await db.documents
        .find()
        .where("isDeleted")
        .eq(true)
        .exec()

      // TODO: use the builtin batch delete function from rxDB and create an actuallyPermanentlyRemoveAllDocuments function to optimize this, because it's agonizingly slow

      for (let doc of documentsInTrash) {
        console.log("deleting", doc)
        await actuallyPermanentlyRemoveDocument(doc.id)
      }
    } else {
      if (options.documentId) {
        await actuallyPermanentlyRemoveDocument(options.documentId)
      } else {
        // TODO: better error handling
        console.error("Missing documentId")
      }
    }
    return close(true)
  }

  const handleCancel = () => close(false)

  const msgPrompt = options.all
    ? "Are you sure you want to permanently delete all documents in trash?"
    : "Are you sure you want to delete this document permanently?"
  const msgConfirm = options.all ? "Yes. Delete all" : "Yes. Delete it"

  return (
    <ModalContainer>
      <p>{msgPrompt}</p>
      <Container>
        <Button onClick={handleConfirm} variant={"danger"}>
          {msgConfirm}
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </Container>
    </ModalContainer>
  )
}
