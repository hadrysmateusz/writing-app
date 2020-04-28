import React from "react"
import { RenderElementProps, useSelected, useFocused } from "slate-react"
import styled from "styled-components/macro"

import { HORIZONTAL_RULE } from "../types"

const HRContainer = styled.div`
  margin: 14px 0;
  padding: 16px 8px;
  cursor: pointer;
`

const HR = styled.div<{ selected: boolean; focused: boolean }>`
  height: 2px;
  background: #efefef;
  box-shadow: ${(props) =>
    props.selected && props.focused ? "0 0 0 3px #B4D5FF" : "none"};
`

export const HorizontalRuleElement = ({
  attributes,
  children,
}: RenderElementProps) => {
  const selected = useSelected()
  const focused = useFocused()

  return (
    <HRContainer {...attributes} data-slate-type={HORIZONTAL_RULE}>
      <div contentEditable={false}>
        <HR selected={selected} focused={focused} />
      </div>
      {children}
    </HRContainer>
  )
}
