import { Editor, Transforms, Location } from "slate"
import { cloneDeep } from "lodash"
import { WithLinkOptions } from "@udecode/plate"
import {
  someNode,
  getAbove,
  isCollapsed,
  unwrapNodes,
  wrapNodes,
  insertNodes,
} from "@udecode/plate-common"
import {
  getPlatePluginType,
  useEventEditorId,
  useStoreEditorState,
  SPEditor,
  TElement,
} from "@udecode/plate-core"
import { ELEMENT_LINK } from "@udecode/plate-link"
import { ToolbarButton, ToolbarButtonProps } from "@udecode/plate-toolbar"

/**
 * Wrap selected nodes with a link and collapse at the end.
 */
export const wrapLink = (
  editor: SPEditor,
  { at, url }: { url: string; at?: Location }
) => {
  wrapNodes(
    editor,
    {
      type: getPlatePluginType(editor, ELEMENT_LINK),
      url,
      children: [],
    },
    { at, split: true }
  )
}

/**
 * Unwrap link at a location (default: selection).
 * Then, the focus of the location is set to selection focus.
 * Then, wrap the link at the location.
 */
export const upsertLinkAtSelection = (
  editor: SPEditor,
  {
    url,
    wrap,
  }: {
    url: string
    /**
     * If true, wrap the link at the location (default: selection) even if the selection is collapsed.
     */
    wrap?: boolean
  }
) => {
  if (!editor.selection) return

  const type = getPlatePluginType(editor, ELEMENT_LINK)

  if (!wrap && isCollapsed(editor.selection)) {
    return insertNodes<TElement>(editor, {
      type,
      url,
      children: [{ text: url }],
    })
  }

  // if our cursor is inside an existing link, but don't have the text selected, select it now
  if (wrap && isCollapsed(editor.selection)) {
    const linkLeaf = Editor.leaf(editor, editor.selection)
    const [, inlinePath] = linkLeaf
    Transforms.select(editor, inlinePath)
  }

  unwrapNodes(editor, { at: editor.selection, match: { type } })

  wrapLink(editor, { at: editor.selection, url })

  Transforms.collapse(editor, { edge: "end" })
}

export const getAndUpsertLink = async <T extends SPEditor>(
  editor: T,
  getLinkUrl: NonNullable<WithLinkOptions["getLinkUrl"]>
) => {
  const type = getPlatePluginType(editor, ELEMENT_LINK)
  let prevUrl = ""

  const linkNode = getAbove(editor, {
    match: { type },
  })
  if (linkNode) {
    prevUrl = linkNode[0].url as string
  }

  // Critical line saving the selection so that it can be restored after you're done clicking in the modal
  const savedSelection = cloneDeep(editor.selection)

  let url = await getLinkUrl(prevUrl)

  // Restoring the saved selection
  editor.selection = savedSelection

  if (!url) {
    linkNode &&
      editor.selection &&
      unwrapNodes(editor, {
        at: editor.selection,
        match: { type: getPlatePluginType(editor, ELEMENT_LINK) },
      })

    return
  }

  // If our cursor is in middle of a link, then we don't want to insert it inline
  const shouldWrap: boolean =
    linkNode !== undefined && isCollapsed(editor.selection)
  upsertLinkAtSelection(editor, { url, wrap: shouldWrap })
}

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
