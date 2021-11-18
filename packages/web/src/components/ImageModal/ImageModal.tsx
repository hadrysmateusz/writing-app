import React, { useMemo, useCallback } from "react"
import { usePlateEditorRef, usePlateEventId } from "@udecode/plate-core"

import createContext from "../../utils/createContext"

import { insertImage } from "../Toolbar"
import { getPromptModalContent, usePromptModal } from "../PromptModal"

import { ImageModalContextValue } from "./types"

export const [ImageModalContext, useImageModal] = createContext<
  ImageModalContextValue
>()

const ImageModalContent = getPromptModalContent("Image url", "Insert Image")

export const ImageModalProvider: React.FC = ({ children }) => {
  const editor = usePlateEditorRef(usePlateEventId("focus"))
  // const editor = useSlateStatic()
  // const [selection, setSelection] = useState<Range | null>(null)

  // const onBeforeOpen = useCallback(() => {
  //   // TODO: save selection state (perhaps override apply and everyone a "set_selection" operation with {newProperties: null} is applied, save the selection (but it's so low-level that I don't know where to store and how to restore it, so maybe a wrapper function will be required (I could store it in local storage, but that might have issues between restarts)))
  //   setSelection(editor.selection)
  //   ReactEditor.deselect(editor)
  //   ReactEditor.blur(editor)
  // }, [editor])

  // const onAfterClose = useCallback(() => {
  //   if (selection) {
  //     setSelection(selection)
  //     ReactEditor.focus(editor)
  //   }
  // }, [editor, selection])

  const { Modal, ...toggleableProps } = usePromptModal("")

  /**
   * Convenience function for opening the modal and getting the url from it
   */
  const getImageUrl = useCallback(async (): Promise<string | null> => {
    const url = await toggleableProps.open({ initialValue: "" })
    return typeof url === "string" ? url : null
  }, [toggleableProps])

  /**
   * Convenience method handling the entire flow for opening the modal and inserting image with resulting url
   */
  const insertImageFromModal = useCallback(async () => {
    if (!editor) {
      console.warn("editor is undefined")
      return
    }
    let url = await getImageUrl()
    if (!url) {
      console.warn("url wasn't provided")
      return
    }
    // TODO: I could do more thorough validation of the url here
    insertImage(editor, url)
  }, [editor, getImageUrl])

  const value = useMemo(
    () => ({ ...toggleableProps, insertImageFromModal, getImageUrl }),
    [insertImageFromModal, getImageUrl, toggleableProps]
  )

  return (
    <ImageModalContext.Provider value={value}>
      <Modal component={ImageModalContent} />
      {children}
    </ImageModalContext.Provider>
  )
}
