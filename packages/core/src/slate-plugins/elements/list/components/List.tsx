import React from "react"
import styled, { css } from "styled-components/macro"
import { RenderElementProps } from "slate-react"
import { ListType } from "../../../../slateTypes"
import { useListContext, ListContextProvider } from "../ListContext"
import { ListItemContextProvider } from "../ListItemContext"

const listCommon = css`
  margin: 14px 0;
  padding: 0;

  li {
    margin: 6px 0;
  }

  li > * {
    /* display: inline-block; */
  }

  padding-inline-start: 24px;
  margin-block-start: 0;
  margin-block-end: 0;
`

const StyledUL = styled.ul`
  /* list-style-type: none; */
  /* li::before {
    content: "";
    color: #41474d;
    display: inline-block;
    background: #41474d;
    height: 6px;
    width: 6px;
    border-radius: 50%;
    margin-bottom: 3px;
    margin-right: 12px;
    margin-left: -1px;
  } */
  ${listCommon}
`

const StyledOL = styled.ol`
  list-style-position: inside;
  ${listCommon}
`

const StyledLI = styled.li``

export const OL = ({ attributes, children }: RenderElementProps) => {
  const { listLevel } = useListContext()

  return (
    <StyledOL {...attributes} data-slate-type={ListType.OL_LIST}>
      <ListContextProvider value={{ listLevel: listLevel + 1 }}>
        {children}
      </ListContextProvider>
    </StyledOL>
  )
}

export const UL = ({ attributes, children }: RenderElementProps) => {
  const { listLevel } = useListContext()
  return (
    <StyledUL {...attributes} data-slate-type={ListType.UL_LIST}>
      <ListContextProvider value={{ listLevel: listLevel + 1 }}>
        {children}
      </ListContextProvider>
    </StyledUL>
  )
}

export const LI = ({ attributes, children, element }: RenderElementProps) => {
  return (
    <StyledLI {...attributes} data-slate-type={ListType.LIST_ITEM}>
      <ListItemContextProvider
        value={{ listItemDirectNode: element.children[0] }}
      >
        {children}
      </ListItemContextProvider>
    </StyledLI>
  )
}
