import {
  getPluginType,
  PlateEditor,
  TElement,
  insertNodes,
} from "@udecode/plate-core"
import { ELEMENT_IMAGE } from "@udecode/plate-image"

export const insertImage = (editor: PlateEditor, url: string | ArrayBuffer) => {
  const text = { text: "" }
  const image = {
    type: getPluginType(editor, ELEMENT_IMAGE),
    url,
    children: [text],
  }
  insertNodes<TElement>(editor, image)
}
