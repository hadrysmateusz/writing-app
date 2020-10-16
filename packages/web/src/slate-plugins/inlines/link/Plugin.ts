import { SlatePlugin } from "@slate-plugin-system/core"

import { renderElementLink } from "./renderElement"
import { withLink } from "./withLink"
import { LinkPluginOptions } from "./types"
import { ReactEditor } from "slate-react"

export const LinkPlugin = (
  options?: LinkPluginOptions
): SlatePlugin<ReactEditor, ReactEditor> => ({
  renderElement: renderElementLink(options),
  editorOverrides: withLink,
})
