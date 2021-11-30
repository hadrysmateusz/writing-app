import { FC } from "react"

import { Button } from "../Button"
import { CloseModalFn } from "../Modal/types"
import { ModalButtonsContainer, ModalContainer } from "../Modal"

import { useDocumentsAPI } from "."

export type ConfirmDeleteModalProps =
  | {
      all: false
      documentId: string | null
    }
  | {
      all: true
      documentId: undefined
    }

export type ConfirmDeleteModalReturnValue = boolean

// TODO: extract this into a reusable modal similiar to the PromptModal
export const ConfirmDeleteModalContent: FC<
  ConfirmDeleteModalProps & {
    close: CloseModalFn<ConfirmDeleteModalReturnValue>
  }
> = ({ close, children, ...options }) => {
  const {
    actuallyPermanentlyRemoveDocument,
    actuallyPermanentlyRemoveAllDocuments,
  } = useDocumentsAPI()

  // TODO: add loading state, especially important when deleting all
  const handleConfirm = async () => {
    if (options.all) {
      console.log("attempting to delete all documents")
      await actuallyPermanentlyRemoveAllDocuments()
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
      <p style={{ marginTop: "4px" }}>{msgPrompt}</p>
      <ModalButtonsContainer>
        {/* TODO: add progress spinner (that only shows up if the confirmation takes more than X miliseconds) */}
        <Button onClick={handleConfirm} variant={"danger"}>
          {msgConfirm}
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </ModalButtonsContainer>
    </ModalContainer>
  )
}
