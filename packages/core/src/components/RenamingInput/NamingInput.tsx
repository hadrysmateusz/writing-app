import React, { forwardRef } from "react"
import TextareaAutosize from "react-autosize-textarea"
import styled from "styled-components/macro"
import isHotkey from "is-hotkey"

export type NamingInputProps = {
  /**
   * Required for styling e.g. with styled-components
   */
  className?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  /**
   * The equivalent of onSubmit - it's the handler that's called to actually
   * trigger the backend renaming logic and other side-effects
   *
   * The value argument should be used instead of whatever the state is in the parent
   * component because it will be sanitized
   */
  onRename: (value: string) => void
  /**
   * onKeyDown should return a "shouldContinue" boolean
   * If it's false the handler will stop running and won't rename
   *
   * This could be replaced by a simple "renameOnEnter" flag but this allows
   * more flexibility that might be useful
   */
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => boolean
}

export const NamingInput = forwardRef<HTMLTextAreaElement, NamingInputProps>(
  (props, ref) => {
    const {
      placeholder = "Untitled",
      value,
      onChange,
      onRename,
      onKeyDown = () => true,
      className,
    } = props

    /**
     * TODO: this sanitizing logic might need some improvements
     */
    const sanitizeValue = (value: string) => value.trim()

    const rename = () => {
      const sanitizedValue = sanitizeValue(value)
      onRename(sanitizedValue)
    }

    const handleBlur = () => {
      /* 
        Make sure that if the title only contains whitespace it gets
        reduced to an empty string to display the placeholder text 
      */
      if (value.trim() === "") onChange("")

      rename()
    }

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const shouldContinue = onKeyDown(event)

      if (shouldContinue === false) return

      if (!isHotkey(["Enter", "Esc"], event)) return

      rename()
    }

    return (
      <StyledAutosizeTextarea
        ref={ref || undefined}
        className={className}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    )
  }
)

const StyledAutosizeTextarea = styled(TextareaAutosize)`
  display: block;
  background: none;
  appearance: none;
  resize: none;
  border: none;
  outline: none;
  width: 100%;
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: inherit;
  font: inherit;
`
