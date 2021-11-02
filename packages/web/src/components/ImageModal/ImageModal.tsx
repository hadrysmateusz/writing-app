import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useEventEditorId, useStoreEditorRef } from "@udecode/plate-core"

import { useModal } from "../Modal"
import { insertImage } from "../Toolbar"

import createContext from "../../utils/createContext"

import {
  ImageModalContentProps,
  ImageModalContextValue,
  ImageModalOpenReturnValue,
  ImageModalProps,
} from "./types"
import { ModalContainer } from "./styledComponents"

export const [ImageModalContext, useImageModal] = createContext<
  ImageModalContextValue
>()

export const ImageModalProvider: React.FC = ({ children }) => {
  const editor = useStoreEditorRef(useEventEditorId("focus"))
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

  const { Modal, ...toggleableProps } = useModal<
    ImageModalOpenReturnValue,
    ImageModalProps
  >(
    false,
    {},
    {
      // onBeforeOpen,
      // onAfterClose,
    }
  )

  /**
   * Convenience function for opening the modal and getting the url from it
   */
  const getImageUrl = useCallback(async (): Promise<string | null> => {
    const url = await toggleableProps.open({})
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

const ImageModalContent: React.FC<ImageModalContentProps> = ({ close }) => {
  const urlInputRef = useRef<HTMLInputElement | null>(null)
  // const editor = useSlateStatic()
  const [url, setUrl] = useState<string>("")

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // if (selection !== null) {
    //   Transforms.select(editor, selection)
    // }
    // if (url.trim() !== "") {
    //   // TODO: url validation (probably inside the insertImage function)
    //   // TODO: handle a situation where it's not a valid url
    //   insertImage(editor, url)
    // }
    close(url)
  }

  useEffect(() => {
    urlInputRef?.current?.focus()
  }, [])

  return (
    <ModalContainer>
      <form onSubmit={onSubmit}>
        <input type="text" value={url} onChange={onChange} ref={urlInputRef} />
        <button type="submit">Add Image</button>
      </form>
    </ModalContainer>
  )
}
