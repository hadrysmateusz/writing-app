import React, { useState, useEffect, useRef, useCallback } from "react"
import { Range, Transforms } from "slate"
import { useSlate, ReactEditor } from "slate-react"
import styled from "styled-components/macro"

import { useModal } from "../Modal"
import { insertImage } from "../../slate-plugins"
import createContext from "../../utils/createContext"
import { Toggleable } from "../../hooks"

const ModalContainer = styled.div`
  background: #252525;
  border: 1px solid #363636;
  padding: 20px;
  border-radius: 4px;
  color: white;
`

const [useImageModal, _, ImageModalContext] = createContext<Toggleable>()

export { useImageModal, ImageModalContext }

export const ImageModalProvider: React.FC = ({ children }) => {
  const editor = useSlate()
  const [selection, setSelection] = useState<Range | null>(null)

  const onBeforeOpen = useCallback(() => {
    // TODO: save selection state (perhaps override apply and everyone a "set_selection" operation with {newProperties: null} is applied, save the selection (but it's so low-level that I don't know where to store and how to restore it, so maybe a wrapper function will be required (I could store it in local storage, but that might have issues between restarts)))
    setSelection(editor.selection)
    ReactEditor.deselect(editor)
    ReactEditor.blur(editor)
  }, [editor])

  const onAfterClose = useCallback(() => {
    if (selection) {
      setSelection(selection)
      ReactEditor.focus(editor)
    }
  }, [editor, selection])

  const { Modal, ...toggleableProps } = useModal(false, {
    onBeforeOpen,
    onAfterClose,
  })

  return (
    <ImageModalContext.Provider value={toggleableProps}>
      <Modal>
        <ImageModalContent selection={selection} />
      </Modal>
      {children}
    </ImageModalContext.Provider>
  )
}

const ImageModalContent: React.FC<{
  selection: Range | null
}> = ({
  /* The way selection is handled here (through a prop) is extremely hacky and should be replaced with a more robust and universal solution for reapplying selection */
  selection,
}) => {
  const urlInputRef = useRef<HTMLInputElement | null>(null)
  const editor = useSlate()
  const [url, setUrl] = useState<string>("")
  const { close } = useImageModal()

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (selection !== null) {
      Transforms.select(editor, selection)
    }
    if (url.trim() !== "") {
      // TODO: url validation (probably inside the insertImage function)
      // TODO: handle a situation where it's not a valid url
      insertImage(editor, url)
    }
    close()
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
