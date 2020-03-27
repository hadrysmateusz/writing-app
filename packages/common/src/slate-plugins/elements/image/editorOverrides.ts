import { EditorOverridesFactory, composeOverrides } from "@slate-plugin-system/core"
import { withBreakInsertDefault } from "../../../slate-helpers"
import { isImageUrl, insertImage } from "./helpers"
import { IMAGE } from "./types"

const withImageCore: EditorOverridesFactory = () => (editor) => {
  const { insertData, isVoid } = editor

  editor.isVoid = (element) => {
    return element.type === IMAGE ? true : isVoid(element)
  }

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData("text/plain")
    const { files } = data
    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split("/")
        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result
            if (url) insertImage(editor, url)
          })
          reader.readAsDataURL(file)
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

export const withImage: EditorOverridesFactory = (options) => {
  return composeOverrides([
    withImageCore(options),
    withBreakInsertDefault({ types: [IMAGE] })
  ])
}
