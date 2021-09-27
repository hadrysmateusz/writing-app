import { useEventEditorId, useStoreEditorRef } from "@udecode/plate-core"
import { ToolbarButton, ToolbarButtonProps } from "@udecode/plate-toolbar"
import { insertNodes } from "@udecode/plate-common"
import { getPlatePluginType, SPEditor, TElement } from "@udecode/plate-core"
import { ELEMENT_IMAGE } from "@udecode/plate-image"

export const insertImage = (editor: SPEditor, url: string | ArrayBuffer) => {
  const text = { text: "" }
  const image = {
    type: getPlatePluginType(editor, ELEMENT_IMAGE),
    url,
    children: [text],
  }
  insertNodes<TElement>(editor, image)
}

export interface ToolbarImageProps extends ToolbarButtonProps {
  getImageUrl: () => Promise<string | null>
}

export const ToolbarImage = ({ getImageUrl, ...props }: ToolbarImageProps) => {
  const editor = useStoreEditorRef(useEventEditorId("focus"))

  return (
    <ToolbarButton
      onMouseDown={async (event) => {
        if (!editor) return

        event.preventDefault()

        let url = await getImageUrl()
        if (!url) return

        insertImage(editor, url)
      }}
      {...props}
    />
  )
}
