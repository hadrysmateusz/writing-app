import React from "react"
import styled from "styled-components/macro"
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaLink,
  FaQuoteRight,
  FaImage,
  FaListOl,
  FaListUl,
  FaPlus,
} from "react-icons/fa"

import { ReactComponent as Heading1 } from "../../assets/Heading1.svg"
import { ReactComponent as Heading2 } from "../../assets/Heading2.svg"

import {
  ListType,
  BLOCKQUOTE,
  CODE_BLOCK,
  HeadingType,
  LINK,
  BOLD,
  ITALIC,
  STRIKE,
  CODE_INLINE,
  IMAGE,
} from "../../slate-plugins"

const Icons = {
  [BOLD]: FaBold,
  [ITALIC]: FaItalic,
  [STRIKE]: FaStrikethrough,
  [CODE_INLINE]: FaCode,
  [LINK]: FaLink,
  [CODE_BLOCK]: FaCode,
  [BLOCKQUOTE]: FaQuoteRight,
  [IMAGE]: FaImage,
  [ListType.OL_LIST]: FaListOl,
  [ListType.UL_LIST]: FaListUl,
  [HeadingType.H1]: Heading1,
  [HeadingType.H2]: Heading2,
  plus: FaPlus,
}

function Icon({ icon, ...rest }) {
  const iconComponent = Icons[icon]
  if (!iconComponent) console.error("invalid icon:", icon)
  return iconComponent ? (
    <IconContainer {...rest}>
      {React.createElement(iconComponent, null, null)}
    </IconContainer>
  ) : null
}

const IconContainer = styled.div`
  color: #afb3b6;
`

export default Icon
