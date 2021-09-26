import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components/macro"

import { useModal } from "../Modal"
import createContext from "../../utils/createContext"
import { CloseModalFn, Modal } from "../Modal/types"

export type LinkModalProps = { prevUrl: string | null }
export type LinkModalOpenReturnValue = string

export type LinkModalContextValue = Modal<
  LinkModalOpenReturnValue,
  LinkModalProps
>

export const [LinkModalContext, useLinkModal] = createContext<
  LinkModalContextValue
>()

// TODO: remove duplication with ImageModal code
// TODO: support other link operations, like changing url or text
export const LinkModalProvider: React.FC = ({ children }) => {
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
    LinkModalOpenReturnValue,
    LinkModalProps
  >(
    false,
    { prevUrl: null },
    {
      // onBeforeOpen,
      // onAfterClose,
    }
  )

  return (
    <LinkModalContext.Provider value={toggleableProps}>
      <Modal>
        {(props) => {
          return <LinkModalContent {...props} />
        }}
      </Modal>
      {children}
    </LinkModalContext.Provider>
  )
}

const LinkModalContent: React.FC<
  LinkModalProps & { close: CloseModalFn<LinkModalOpenReturnValue> }
> = ({ close, prevUrl }) => {
  const urlInputRef = useRef<HTMLInputElement | null>(null)
  // const editor = useSlateStatic()
  const [url, setUrl] = useState<string>(prevUrl ?? "")

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    close(url)
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

const ModalContainer = styled.div`
  background: #252525;
  border: 1px solid #363636;
  padding: 20px;
  border-radius: 4px;
  color: white;
`
