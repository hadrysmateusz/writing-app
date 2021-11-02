import { someNode } from "@udecode/plate-common"
import {
  getPlatePluginType,
  useEventEditorId,
  useStoreEditorState,
} from "@udecode/plate-core"
import { ELEMENT_LINK } from "@udecode/plate-link"
import { ToolbarButton, ToolbarButtonProps } from "@udecode/plate-toolbar"

import { getAndUpsertLink } from "./helpers"

export interface ToolbarLinkProps extends ToolbarButtonProps {
  getLinkUrl: (prevUrl: string | null) => Promise<string | null>
}

export const ToolbarLink = ({ getLinkUrl, ...props }: ToolbarLinkProps) => {
  const editor = useStoreEditorState(useEventEditorId("focus"))

  const type = getPlatePluginType(editor, ELEMENT_LINK)
  const isLink = !!editor?.selection && someNode(editor, { match: { type } })

  return (
    <ToolbarButton
      active={isLink}
      onMouseDown={async (event) => {
        if (!editor) return

        event.preventDefault()
        getAndUpsertLink(editor, getLinkUrl)
      }}
      {...props}
    />
  )
}

export default ToolbarLink
