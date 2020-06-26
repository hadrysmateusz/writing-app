import React from "react"
import { RenderElementProps } from "slate-react"

import { HeadingType, RenderElementHeadingOptions } from "./types"
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from "./components"
import { Toolbar } from "../../../components/NodeToolbar"

export const renderElementHeading = ({
  levels = 6,
  H1 = Heading1, // level 1 is treated as a "Heading" on medium
  H2 = Heading2, // level 2 is treated as a "Sub-Heading" on medium
  H3 = Heading3, // level 3 is treated like level 2 on medium
  H4 = Heading4, // level 4 is treated like level 2 on medium
  H5 = Heading5, // level 5 isn't supported on medium, it's rendered like regular text
  H6 = Heading6, // level 6 isn't supported on medium, it's rendered like regular text
}: RenderElementHeadingOptions = {}) => (props: RenderElementProps) => {
  const {
    element: { type },
    attributes,
    children,
  } = props

  if (levels >= 1 && type === HeadingType.H1)
    return (
      <H1 {...attributes} data-slate-type={HeadingType.H1}>
        <Toolbar nodeRef={attributes.ref} />
        {children}
      </H1>
    )
  if (levels >= 2 && type === HeadingType.H2)
    return (
      <H2 {...attributes} data-slate-type={HeadingType.H2}>
        <Toolbar nodeRef={attributes.ref} />
        {children}
      </H2>
    )
  if (levels >= 3 && type === HeadingType.H3)
    return (
      <H3 {...attributes} data-slate-type={HeadingType.H3}>
        <Toolbar nodeRef={attributes.ref} />
        {children}
      </H3>
    )
  if (levels >= 4 && type === HeadingType.H4)
    return (
      <H4 {...attributes} data-slate-type={HeadingType.H4}>
        <Toolbar nodeRef={attributes.ref} />
        {children}
      </H4>
    )
  if (levels >= 5 && type === HeadingType.H5)
    return (
      <H5 {...attributes} data-slate-type={HeadingType.H5}>
        <Toolbar nodeRef={attributes.ref} />
        {children}
      </H5>
    )
  if (levels >= 6 && type === HeadingType.H6)
    return (
      <H6 {...attributes} data-slate-type={HeadingType.H6}>
        <Toolbar nodeRef={attributes.ref} />
        {children}
      </H6>
    )
}
