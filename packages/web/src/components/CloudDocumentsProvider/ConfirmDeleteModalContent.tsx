import { FC } from "react"

import { Button } from "../Button"
import { CloseModalFn } from "../Modal/types"
import {
  ModalContainer,
  ModalButtonsContainer,
  ModalMessageContainer,
  ModalSecondaryMessageContainer,
} from "../Modal"
import { useDocumentsAPI } from "./CloudDocumentsProvider"

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

// TODO: make this use the standard Confirm modal
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
      <ModalMessageContainer>{msgPrompt}</ModalMessageContainer>
      <ModalSecondaryMessageContainer>
        This action can't be undone
      </ModalSecondaryMessageContainer>
      <ModalButtonsContainer>
        {/* TODO: add progress spinner (that only shows up if the confirmation takes more than X miliseconds) */}
        <Button onClick={handleConfirm} variant={"danger"} fullWidth>
          {msgConfirm}
        </Button>
        <Button onClick={handleCancel} fullWidth>
          Cancel
        </Button>
      </ModalButtonsContainer>
    </ModalContainer>
  )
}
