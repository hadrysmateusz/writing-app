import React, { useEffect, useRef, useState } from "react"
import { ToggleableHooks } from "../../hooks"
import { useModal, ModalContainer } from "../Modal"
import { ModalContentProps } from "../Modal/types"

export type PromptModalOpenReturnValue = string
export type PromptModalProps = { initialValue: string }

export type PromptModalContentProps = ModalContentProps<
  PromptModalOpenReturnValue,
  PromptModalProps
>

export function usePromptModal(
  initialValue: string,
  options?: ToggleableHooks
) {
  return useModal<PromptModalOpenReturnValue, PromptModalProps>(
    false,
    { initialValue },
    options
  )
}

// TODO: replace (at least temporarily) the link and image modals with this one
export function getPromptModalContent(
  promptMessage: string,
  submitMessage: string
) {
  const PromptModalContent: React.FC<PromptModalContentProps> = ({
    close,
    initialValue = "",
  }) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [value, setValue] = useState<string>(initialValue)

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value)
    }

    const onSubmit = (event: React.FormEvent) => {
      event.preventDefault()
      close(value)
    }

    useEffect(() => {
      inputRef?.current?.focus()
    }, [])

    return (
      <ModalContainer>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: "12px" }}>{promptMessage}</div>
          <input type="text" value={value} onChange={onChange} ref={inputRef} />
          <button type="submit">{submitMessage}</button>
        </form>
      </ModalContainer>
    )
  }

  return PromptModalContent
}
