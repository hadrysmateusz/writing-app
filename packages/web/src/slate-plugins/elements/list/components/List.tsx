import React from "react"
import styled, { css } from "styled-components/macro"
import { RenderElementProps } from "slate-react"
import {
  ListType,
  ELEMENT_UL_LIST,
  ELEMENT_PARAGRAPH,
  ELEMENT_OL_LIST,
} from "../../../../slateTypes"
import { useListContext, ListContextProvider } from "../ListContext"
import { ListItemContextProvider } from "../ListItemContext"
import { config } from "../../../../dev-tools"

// TODO: make ordered and unordered lists have the same effective indentation (Might require custom counters, and 3 digits is probably max)

const listCommon = css<{ noIndent: boolean; debugStyles: boolean }>`
  margin: 14px 0;
  padding: 0;

  li {
    margin: 6px 0;
  }

  li > *:first-child {
    display: inline-block;
  }

  /* TODO: many more edge cases will probably be needed */
  [data-slate-type="${ELEMENT_PARAGRAPH}"] + [data-slate-type="${ELEMENT_UL_LIST}"],
  [data-slate-type="${ELEMENT_PARAGRAPH}"] + [data-slate-type="${ELEMENT_OL_LIST}"] {
    /* TODO: base the margin on the actual size of the paragraph margin */
    margin-top: -14px;
  }

  padding-inline-start: ${(p) => (p.noIndent ? "0" : "24px")};
  margin-block-start: 0;
  margin-block-end: 0;

  ${(p) =>
    p.debugStyles &&
    css`
      border: 1px dashed red;
      background: rgba(255, 0, 0, 0.15);
      padding: 4px;
      padding-inline-start: 28px;
    `}
`

const StyledUL = styled.ul<{ debugStyles: boolean }>`
  list-style-type: none;
  li {
    position: relative;
  }
  li::before {
    position: absolute;
    /* TODO: find a better way to find a top offset that responds properly to changes */
    top: 11px;
    left: -18px;
    content: "";
    color: #41474d;
    display: block;
    background: #41474d;
    height: 6px;
    width: 6px;
    border-radius: 50%;
  }
  ${listCommon}
`

const StyledOL = styled.ol<{
  debugStyles: boolean
  noIndent: boolean
}>`
  list-style-position: inside;
  li::marker {
    color: #717171;
    font-weight: 600;
  }
  ${listCommon}
`

const StyledLI = styled.li<{ debugStyles: boolean }>`
  ${(p) =>
    p.debugStyles &&
    `border: 1px dashed green;
    background: rgba(0, 255, 0, 0.15);
    padding: 4px;`}
`

export const OL = ({ attributes, children }: RenderElementProps) => {
  const { listLevel } = useListContext()

  return (
    <StyledOL
      {...attributes}
      data-slate-type={ListType.OL_LIST}
      debugStyles={!!config.debugStyles}
      noIndent={!!(listLevel === 0)}
    >
      <ListContextProvider value={{ listLevel: listLevel + 1 }}>
        {children}
      </ListContextProvider>
    </StyledOL>
  )
}

export const UL = ({ attributes, children }: RenderElementProps) => {
  const { listLevel } = useListContext()
  return (
    <StyledUL
      {...attributes}
      data-slate-type={ListType.UL_LIST}
      debugStyles={config.debugStyles}
    >
      <ListContextProvider value={{ listLevel: listLevel + 1 }}>
        {children}
      </ListContextProvider>
    </StyledUL>
  )
}

export const LI = ({ attributes, children, element }: RenderElementProps) => {
  return (
    <StyledLI
      {...attributes}
      data-slate-type={ListType.LIST_ITEM}
      debugStyles={config.debugStyles}
    >
      <ListItemContextProvider
        value={{ listItemDirectNode: element.children[0] }}
      >
        {children}
      </ListItemContextProvider>
    </StyledLI>
  )
}
