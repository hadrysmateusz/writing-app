import React, { useRef } from "react"
import { ToggleableHooks } from "../../hooks"
import { Button, ButtonVariants } from "../Button"
import {
  useModal,
  ModalContainer,
  ModalButtonsContainer,
  ModalMessageContainer,
  ModalSecondaryMessageContainer,
} from "../Modal"
import { ModalContentProps } from "../Modal/types"

export type ConfirmModalOpenReturnValue = boolean
export type ConfirmModalProps = {}
export type ConfirmModalContentProps = ModalContentProps<
  ConfirmModalOpenReturnValue,
  ConfirmModalProps
>
export type ConfirmModalOptions =
  ToggleableHooks<ConfirmModalOpenReturnValue> & {
    onConfirm?: () => void
    onCancel?: () => void
  }

export function useConfirmModal(options: ConfirmModalOptions = {}) {
  const { onConfirm, onCancel, ...modalOptions } = options
  return useModal<ConfirmModalOpenReturnValue, ConfirmModalProps>(
    false,
    {},
    {
      ...modalOptions,
      onAfterClose: (resolveValue) => {
        // call onConfirm or onCancel based on resolveValue if these hooks are provided
        if (resolveValue === undefined || resolveValue === false) {
          onCancel && onCancel()
        } else {
          onConfirm && onConfirm()
        }
        // call the onAfterClose hook from options if it's provided
        modalOptions.onAfterClose && modalOptions.onAfterClose(resolveValue)
      },
    }
  )
}

export function getConfirmModalContent({
  promptMessage = "Are you sure?",
  secondaryPromptMessage,
  confirmMessage = "OK",
  cancelMessage = "Cancel",
  confirmButtonVariant = "danger", // TODO: replace with primary when it's fixed
}: {
  promptMessage?: string
  secondaryPromptMessage?: string
  confirmMessage?: string
  cancelMessage?: string
  confirmButtonVariant?: ButtonVariants
} = {}) {
  const ConfirmModalContent: React.FC<ConfirmModalContentProps> = ({
    close,
  }) => {
    const confirmBtnRef = useRef<HTMLButtonElement | null>(null)
    const cancelBtnRef = useRef<HTMLButtonElement | null>(null)

    const handleConfirm = (event: React.FormEvent) => {
      event.preventDefault()
      close(true)
    }

    const handleCancel = (event: React.FormEvent) => {
      event.preventDefault()
      close(false)
    }

    // useEffect(() => {
    //   confirmBtnRef?.current?.focus()
    // }, [])

    return (
      <ModalContainer>
        <ModalMessageContainer>{promptMessage}</ModalMessageContainer>
        {secondaryPromptMessage ? (
          <ModalSecondaryMessageContainer>
            {secondaryPromptMessage}
          </ModalSecondaryMessageContainer>
        ) : null}
        <ModalButtonsContainer>
          <Button
            onClick={handleConfirm}
            variant={confirmButtonVariant}
            ref={confirmBtnRef}
          >
            {confirmMessage}
          </Button>
          <Button onClick={handleCancel} ref={cancelBtnRef} fullWidth>
            {cancelMessage}
          </Button>
        </ModalButtonsContainer>
      </ModalContainer>
    )
  }

  return ConfirmModalContent
}
