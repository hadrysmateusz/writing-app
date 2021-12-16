import React, { useCallback, useEffect, useRef, useState } from "react"
import styled from "styled-components/macro"

import { ToggleableHooks } from "../../hooks"

import { Button } from "../Button"
import {
  useModal,
  ModalContainer,
  ModalMessageContainer,
  ModalContentProps,
  ModalSecondaryMessageContainer,
} from "../Modal"
import { TextInput } from "../TextInput"

export type PromptModalOpenReturnValue = string
export type PromptModalProps = { initialValue: string }

export type PromptModalContentProps = ModalContentProps<
  PromptModalOpenReturnValue,
  PromptModalProps
>

export function usePromptModal(
  initialValue: string,
  options?: ToggleableHooks<PromptModalOpenReturnValue>
) {
  return useModal<PromptModalOpenReturnValue, PromptModalProps>(
    false,
    { initialValue },
    options
  )
}

export function getPromptModalContent({
  promptMessage,
  secondaryPromptMessage,
  submitMessage = "OK",
  inputPlaceholder = "",
}: {
  promptMessage: string
  secondaryPromptMessage?: string
  submitMessage?: string
  inputPlaceholder?: string
}) {
  const PromptModalContent: React.FC<PromptModalContentProps> = ({
    close,
    initialValue = "",
  }) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [value, setValue] = useState<string>(initialValue)

    const onChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
      },
      []
    )

    const onSubmit = useCallback(
      (event: React.FormEvent) => {
        event.preventDefault()
        close(value)
      },
      [close, value]
    )

    useEffect(() => {
      inputRef?.current?.focus()
    }, [])

    return (
      <ModalContainer>
        <form onSubmit={onSubmit}>
          <ModalMessageContainer>{promptMessage}</ModalMessageContainer>
          {secondaryPromptMessage ? (
            <ModalSecondaryMessageContainer>
              {secondaryPromptMessage}
            </ModalSecondaryMessageContainer>
          ) : null}
          <PromptModalInnerContainer>
            <TextInput
              type="text"
              value={value}
              onChange={onChange}
              placeholder={inputPlaceholder}
              ref={inputRef}
            />
            <Button type="submit" variant="primary" fullWidth>
              {submitMessage}
            </Button>
          </PromptModalInnerContainer>
        </form>
      </ModalContainer>
    )
  }

  return PromptModalContent
}

const PromptModalInnerContainer = styled.div`
  width: 320px;
  display: grid;
  grid-template-columns: 60fr 40fr;
  gap: 12px;
  /* display: flex; */
  /* > :last-child {
    flex-grow: 1;
  } */
`
