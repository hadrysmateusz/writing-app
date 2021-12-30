import React, { useRef, useState, useEffect } from "react"
import styled from "styled-components/macro"

import { NamingInput } from "./NamingInput"
import { useOnClickOutside } from "../../hooks"

export type EditableTextProps = {
  placeholder?: string
  className?: string
  value: string
  isEditing: boolean
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>
  disabled?: boolean
  style?: React.CSSProperties | undefined
  onApply: (value: string) => void
  onChange: (value: string) => void
  startRenaming: () => void
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
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

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

  useOnClickOutside(inputRef, () => {
    onRename(value)
    stopRenaming()
  })

  useEffect(() => {
    // Focus and select the input
    if (isRenaming && inputRef?.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(0, inputRef.current.value.length)
    }
  }, [isRenaming])

  // TODO: change names of methods to make them more universal
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
      startRenaming,
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
  disabled = false,
  onKeyDown = () => true,
  onClick,
  onChange,
  onApply,
  startRenaming,
  style,
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

  const handleDoubleClick = () => {
    startRenaming()
  }

  return (
    <Container className={className} style={style}>
      {!disabled && isEditing ? (
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
        <Static
          onClick={onClick}
          className="EditableText_static"
          onDoubleClick={handleDoubleClick}
        >
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
  font-family: inherit;
  color: inherit;
  font-size: inherit;

  /* These styles are defaults that are used almost everywhere but can still be overriden using the className of the component*/
  border: 1px solid var(--dark-500);
  border-radius: 3px;
  padding: 1px 2px;

  ::selection {
    color: white;
    background: var(--selection-color);
  }
`
