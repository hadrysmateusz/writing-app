import React from "react"
import { RenderElementProps } from "slate-react"

// import { getElement } from "@slate-plugin-system/core"

import { RenderElementListOptions } from "./types"
import {
  UL as ULComponent,
  OL as OLComponent,
  LI as LiComponent,
} from "./components"

import { ListType } from "../../../slateTypes"

export const renderElementList = ({
  UL = ULComponent,
  OL = OLComponent,
  LI = LiComponent,
}: RenderElementListOptions = {}) => (props: RenderElementProps) => {
  switch (props.element.type) {
    case ListType.UL_LIST:
      return <UL {...props} />
    case ListType.OL_LIST:
      return <OL {...props} />
    case ListType.LIST_ITEM:
      return <LI {...props} />
    default:
      break
  }
}
