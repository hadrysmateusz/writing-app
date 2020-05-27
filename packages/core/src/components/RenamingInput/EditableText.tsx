import React, { forwardRef } from "react"
import styled from "styled-components/macro"

import { NamingInput, NamingInputProps } from "./NamingInput"

export type EditableTextProps = NamingInputProps & {
  isRenaming: boolean
  staticValue: string
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

/**
 * To style individual states use these classes:
 *
 * - EditableText_static - for the static display state
 * - EditableText_editable - for the editable state
 *
 * TODO: make it easier to style the editable and static states separately
 * maybe use a hook that will return the static and editable components along with the isRenaming state
 */
export const EditableText = forwardRef<HTMLTextAreaElement, EditableTextProps>(
  (props, ref) => {
    const {
      placeholder = "Untitled",
      value,
      isRenaming,
      staticValue,
      className,
      onChange,
      onRename,
      onKeyDown = () => true,
      onClick,
    } = props

    const innerOnKeyDown = (
      event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      if (!isRenaming) {
        return false
      } else {
        return onKeyDown(event)
      }
    }

    return (
      <Container className={className}>
        {isRenaming ? (
          <Editable
            ref={ref || undefined}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyDown={innerOnKeyDown}
            onRename={onRename}
            className="EditableText_editable"
          />
        ) : (
          <Static onClick={onClick} className="EditableText_static">
            {staticValue}
          </Static>
        )}
      </Container>
    )
  }
)

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

const Editable = styled(NamingInput)`
  color: #fbfbfb;
  font-family: "Segoe UI", "Open sans", "sans-serif";
  font-size: 12px;
`
