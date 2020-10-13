import { getRenderElement } from "@slate-plugin-system/core"

import { LinkElement } from "./components"
import { LINK } from "./types"

export const renderElementLink = getRenderElement({
  type: LINK,
  component: LinkElement,
})
