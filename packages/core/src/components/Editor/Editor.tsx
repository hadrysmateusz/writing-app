import React, { KeyboardEvent, useState, useRef, useEffect } from "react"
import { Editable, OnKeyDown } from "@slate-plugin-system/core"
import isHotkey from "is-hotkey"

import { plugins } from "../../pluginsList"
import { Toolbar } from "../Toolbar"
import HoveringToolbar from "../HoveringToolbar"
import { EditableContainer, Container, TitleInput } from "./styledComponents"
import { Document } from "models"
import { useEditor, ReactEditor } from "slate-react"

const EditorComponent: React.FC<{
  saveDocument: () => Promise<Document | null>
  renameDocument: (title: string) => Promise<Document | null>
  currentDocument: Document
}> = ({ saveDocument, renameDocument, currentDocument }) => {
  const [title, setTitle] = useState<string>(currentDocument.title)
  const titleRef = useRef<HTMLInputElement | null>(null)
  const editor = useEditor()

  // // When the document title changes elsewhere, update the state here
  // useEffect(() => {
  //   setTitle(currentDocument.title)
  // }, [currentDocument.title, setTitle])

  /**
   * Focus the correct element on mount
   */
  useEffect(() => {
    if (title === "") {
      titleRef.current?.focus()
    } else {
      ReactEditor.focus(editor)
    }
    // eslint-disable-next-line
  }, [])

  const handleSaveDocument: OnKeyDown = async (event: KeyboardEvent) => {
    if (isHotkey("mod+s", event)) {
      event.preventDefault()
      await saveDocument()
    }
  }

  const handleContentBlur = async () => {
    // TODO: if you close the window or reload without clicking on something else the blur doesn't trigger and the content doesn't get saved
    await saveDocument()
  }

  const handleTitleBlur = () => {
    if (title?.trim() === "") setTitle("")
    const newTitle = title === null || title.trim() === "" ? "" : title
    renameDocument(newTitle)
  }

  return (
    <Container>
      <HoveringToolbar />
      <Toolbar />
      <TitleInput
        ref={titleRef}
        type="text"
        value={title || ""}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        placeholder="Untitled"
      />
      <EditableContainer onBlur={handleContentBlur}>
        <Editable
          plugins={plugins}
          onKeyDown={[handleSaveDocument]}
          spellCheck={false}
        />
      </EditableContainer>
    </Container>
  )
}

export default EditorComponent
