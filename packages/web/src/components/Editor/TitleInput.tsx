import React, { useState, useRef, useEffect } from "react"
import styled from "styled-components/macro"
import { ReactEditor } from "slate-react"
import { Transforms } from "slate"
import isHotkey from "is-hotkey"
import { useStoreEditorRef, useEventEditorId } from "@udecode/plate"

import { NamingInput } from "../RenamingInput"
import { useDocumentsAPI } from "../MainProvider"
import { DocumentDoc } from "../Database"

import { createEmptyNode } from "../../helpers/createEmptyNode"

const StyledNamingInput = styled(NamingInput)`
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: bold;
  font-family: "Poppins";
  letter-spacing: 0.01em;
  font-size: 36px;
  line-height: 54px;
  color: #f8f8f8;
`

const TitleInput: React.FC<{ currentDocument: DocumentDoc }> = ({
  currentDocument,
}) => {
  const { renameDocument } = useDocumentsAPI()

  const editor = useStoreEditorRef(useEventEditorId("focus"))

  const [value, setValue] = useState<string>(currentDocument.title)
  const titleRef = useRef<HTMLTextAreaElement | null>(null)

  // When the document title changes elsewhere, update the state here
  useEffect(() => {
    setValue(currentDocument.title)
  }, [currentDocument.title])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (editor === undefined) {
      console.error("editor is undefined ")
      return false
    }

    // TODO: allow other ways of navigating between the title and editor content like arrow down and up (there are many multi-line considerations there)
    // TODO: why is the Esc here?
    if (isHotkey(["Enter", "Esc"], event)) {
      // prevent the line break from being inserted into the title (TODO: some version of this behavior might be desirable)
      event.preventDefault()
      // TODO: insert an empty block at the start of the editor
      Transforms.insertNodes(editor, createEmptyNode(), {
        at: [0],
        select: true,
      })
      // move focus to the editor (as if the title was a part of the editable area) - this will automatically trigger a rename
      ReactEditor.focus(editor)
      return false
    }
    return true
  }

  const onChange = (newValue: string) => {
    setValue(newValue)
  }

  const onRename = (newValue: string) => {
    renameDocument(currentDocument.id, newValue)
  }

  const getTitleInputProps = () => ({ onKeyDown, onChange, onRename, value })

  return <StyledNamingInput ref={titleRef} {...getTitleInputProps()} />
}

export default TitleInput
