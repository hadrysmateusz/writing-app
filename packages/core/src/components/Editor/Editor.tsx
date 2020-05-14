import React, { KeyboardEvent, useState } from "react"
import { Editable, OnKeyDown } from "@slate-plugin-system/core"
import isHotkey from "is-hotkey"

import { plugins } from "../../pluginsList"
import { Toolbar } from "../Toolbar"
import HoveringToolbar from "../HoveringToolbar"
import { EditableContainer, Container, TitleInput } from "./styledComponents"
import { Document } from "models"

const EditorComponent: React.FC<{
  saveDocument: () => Promise<Document | null>
  renameDocument: (title: string) => Promise<Document | null>
  currentDocument: Document
}> = ({ saveDocument, renameDocument, currentDocument }) => {
  const [title, setTitle] = useState<string>(currentDocument.title)

  // // When the document title changes elsewhere, update the state here
  // useEffect(() => {
  //   setTitle(currentDocument.title)
  // }, [currentDocument.title, setTitle])

  const handleSaveDocument: OnKeyDown = async (event: KeyboardEvent) => {
    if (isHotkey("mod+s", event)) {
      event.preventDefault()
      const updatedDocument = saveDocument()
      if (updatedDocument === null) {
        alert("There was a problem while saving the document")
      }
    }
  }

  const handleBlur = () => {
    if (title?.trim() === "") setTitle("")
    const newTitle = title === null || title.trim() === "" ? "" : title
    renameDocument(newTitle)
  }

  return (
    <Container>
      {/* {currentDocument.id} */}
      <HoveringToolbar />
      <Toolbar />
      {
        <>
          <TitleInput
            type="text"
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            placeholder="Untitled"
          />
        </>
      }
      <EditableContainer>
        <Editable
          plugins={plugins}
          onKeyDown={[handleSaveDocument]}
          autoFocus
          spellCheck={false}
        />
      </EditableContainer>
    </Container>
  )
}

export default EditorComponent
