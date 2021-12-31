import { usePlateEditorRef, getPlateId } from "@udecode/plate-core"
import { ToolbarButton, ToolbarButtonProps } from "@udecode/plate-ui-toolbar"

import { insertImage } from "./helpers"

export interface ToolbarImageProps extends ToolbarButtonProps {
  getImageUrl: () => Promise<string | null>
}

export const ToolbarImage = ({ getImageUrl, ...props }: ToolbarImageProps) => {
  const editor = usePlateEditorRef(getPlateId("focus"))

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
