import React, { useRef, useState, useEffect } from "react"
import styled from "styled-components/macro"

import { NamingInput } from "./NamingInput"

export type EditableTextProps = {
  placeholder?: string
  className?: string
  value: string
  isEditing: boolean
  inputRef: React.MutableRefObject<HTMLTextAreaElement | undefined>
  onApply: (value: string) => void
  onChange: (value: string) => void
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  /**
   * onKeyDown should return a "shouldContinue" boolean
   * If it's false the handler will stop running and won't rename
   *
   * This could be replaced by a simple "renameOnEnter" flag but this allows
   * more flexibility that might be useful
   */
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => boolean
}

export const useEditableText = (
  outsideValue: string,
  onRename: (value: string) => void
) => {
  const [isRenaming, setIsRenaming] = useState(false)
  const [value, setValue] = useState(outsideValue)
  const inputRef = useRef<HTMLTextAreaElement>()

  const startRenaming = () => {
    setValue(outsideValue)
    setIsRenaming(true)
  }

  const stopRenaming = () => {
    setIsRenaming(false)
  }

  const onApply = (value: string) => {
    if (!isRenaming) return
    stopRenaming()
    onRename(value)
  }

  // useEffect(() => {
  //   if (!isRenaming) {
  //     setTitleValue(outsideValue)
  //   }
  // }, [document.title, isRenaming])

  useEffect(() => {
    // Focus and select the input
    if (isRenaming && inputRef?.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(0, inputRef.current.value.length)
    }
  }, [isRenaming])

  return {
    isRenaming,
    startRenaming,
    stopRenaming,
    getProps: () => ({
      value,
      inputRef,
      isEditing: isRenaming,
      onChange: setValue,
      onApply,
    }),
  }
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  inputRef,
  isEditing,
  placeholder = "Untitled",
  children,
  className,
  onKeyDown = () => true,
  onClick,
  onChange,
  onApply,
}) => {
  const innerOnKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isEditing) {
      return false
    } else {
      return onKeyDown(event)
    }
  }

  const handleChange = (newValue: string) => {
    onChange(newValue)
  }

  return (
    <Container className={className}>
      {isEditing ? (
        <StyledNamingInput
          // TODO: resolve this type issue
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={innerOnKeyDown}
          onRename={onApply}
          className="EditableText_editable"
        />
      ) : (
        <Static onClick={onClick} className="EditableText_static">
          {children}
        </Static>
      )}
    </Container>
  )
}

const Container = styled.div`
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-word;
  width: 100%;
`

const Static = styled.div`
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: none;
  color: inherit;
  font: inherit;
`

const StyledNamingInput = styled(NamingInput)`
  color: #fbfbfb;
  font-family: "Segoe UI", "Open sans", "sans-serif";
  font-size: 12px;
`
