import React, { useState, useEffect, useRef, useCallback } from "react"
import { Range, Transforms } from "slate"
import { useSlate, ReactEditor } from "slate-react"
import styled from "styled-components/macro"

import { useModal } from "../Modal"
import { insertLink } from "../../slate-plugins"
import createContext from "../../utils/createContext"
import { Toggleable } from "../../hooks"

const ModalContainer = styled.div`
  background: #252525;
  border: 1px solid #363636;
  padding: 20px;
  border-radius: 4px;
  color: white;
`

const [useLinkModal, _, LinkModalContext] = createContext<Toggleable>()

export { useLinkModal, LinkModalContext }

// TODO: remove duplication with ImageModal code
// TODO: support other link operations, like changing url or text
export const LinkModalProvider: React.FC = ({ children }) => {
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
    <LinkModalContext.Provider value={toggleableProps}>
      <Modal>
        <LinkModalContent selection={selection} />
      </Modal>
      {children}
    </LinkModalContext.Provider>
  )
}

const LinkModalContent: React.FC<{
  selection: Range | null
}> = ({
  /* The way selection is handled here (through a prop) is extremely hacky and should be replaced with a more robust and universal solution for reapplying selection */
  selection,
}) => {
  const urlInputRef = useRef<HTMLInputElement>()
  const editor = useSlate()
  const [url, setUrl] = useState<string>("")
  const { close } = useLinkModal()

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (selection !== null) {
      Transforms.select(editor, selection)
    }
    if (url.trim() !== "") {
      insertLink(editor, url)
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
        <button type="submit">Add Link</button>
      </form>
    </ModalContainer>
  )
}
