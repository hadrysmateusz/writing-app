import { usePlateEditorRef, usePlateEventId } from "@udecode/plate-core"
import { ToolbarButton, ToolbarButtonProps } from "@udecode/plate-toolbar"

import { insertImage } from "./helpers"

export interface ToolbarImageProps extends ToolbarButtonProps {
  getImageUrl: () => Promise<string | null>
}

export const ToolbarImage = ({ getImageUrl, ...props }: ToolbarImageProps) => {
  const editor = usePlateEditorRef(usePlateEventId("focus"))

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

export default ToolbarImage
