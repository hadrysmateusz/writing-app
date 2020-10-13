import React from "react"
import styled from "styled-components/macro"
import { getRenderLeaf } from "@slate-plugin-system/core"
import { STRIKE } from "./types"

const Strikethrough = styled.span`
  text-decoration: line-through;
`

export const renderLeafStrikethrough = getRenderLeaf({
  type: STRIKE,
  component: (props) => <Strikethrough>{props.children}</Strikethrough>,
})
