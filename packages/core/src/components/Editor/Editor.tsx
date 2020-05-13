import React, { KeyboardEvent, useState } from "react"
import styled from "styled-components/macro"
import { Editable, OnKeyDown } from "@slate-plugin-system/core"
import isHotkey from "is-hotkey"

import { plugins } from "../../pluginsList"
import { Toolbar } from "../Toolbar"
import HoveringToolbar from "../HoveringToolbar"
import { EditableContainer } from "./styledComponents"
import { Document } from "models"

const EditorComponent: React.FC<{
  saveDocument: () => Promise<Document | null>
  renameDocument: (title: string) => Promise<Document | null>
  currentDocument: Document
}> = ({ saveDocument, renameDocument, currentDocument }) => {
  const [title, setTitle] = useState<string | null>(currentDocument.title)

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

  const handleRename = () => {
    const newTitle = title === null || title.trim() === "" ? "Untitled" : title
    renameDocument(newTitle)
  }

  return (
    <Container>
      {/* {currentDocument.id} */}
      <HoveringToolbar />
      <Toolbar />
      {title === null ? (
        "Untitled"
      ) : (
        <>
          <TitleInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleRename}
            placeholder="Untitled"
          />
        </>
      )}
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

const Container = styled.div`
  margin: 40px auto;
  padding: 20px;
  width: 600px;
  font-size: 20px;
  box-sizing: content-box;
`

const TitleInput = styled.input`
  background: none;
  border: none;
  padding: 0;
  font-size: 28px;
  margin-top: 20px;
  color: white;
  font-weight: bold;
  outline: none;
`

export default EditorComponent
