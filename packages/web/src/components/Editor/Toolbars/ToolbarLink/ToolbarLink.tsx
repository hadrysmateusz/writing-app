import {
  someNode,
  getPluginType,
  getPlateId,
  usePlateEditorState,
} from "@udecode/plate-core"
import { ELEMENT_LINK } from "@udecode/plate-link"
import { ToolbarButton, ToolbarButtonProps } from "@udecode/plate-ui-toolbar"

import { getAndUpsertLink } from "./helpers"

export interface ToolbarLinkProps extends ToolbarButtonProps {
  getLinkUrl: (prevUrl: string) => Promise<string | null>
}

// TODO: change name to be in line with plate's new ui elements naming style
export const ToolbarLink = ({ getLinkUrl, ...props }: ToolbarLinkProps) => {
  const editor = usePlateEditorState(getPlateId("focus"))

  const type = editor ? getPluginType(editor, ELEMENT_LINK) : null
  const isLink = !!editor?.selection && someNode(editor, { match: { type } })

  return editor ? (
    <ToolbarButton
      active={isLink}
      onMouseDown={async (event) => {
        if (!editor) return

        event.preventDefault()
        getAndUpsertLink(editor, getLinkUrl)
      }}
      {...props}
    />
  ) : null
}

export default ToolbarLink
