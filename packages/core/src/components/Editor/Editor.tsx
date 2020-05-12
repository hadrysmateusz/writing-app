import React, { KeyboardEvent, useState, useEffect } from "react"
import styled from "styled-components/macro"
import { Editable, OnKeyDown } from "@slate-plugin-system/core"
import isHotkey from "is-hotkey"
import { useDebounce } from "use-debounce"

import { plugins } from "../../pluginsList"
import { Toolbar } from "../Toolbar"
import HoveringToolbar from "../HoveringToolbar"
import { EditableContainer } from "./styledComponents"
import { Document } from "models"

// TODO: sync and allow updating title

const EditorComponent: React.FC<{
  saveDocument: () => Promise<Document | null>
  renameDocument: (title: string) => Promise<Document | null>
  currentDocument: Document
}> = ({ saveDocument, renameDocument, currentDocument }) => {
  const [title, setTitle] = useState<string>(
    currentDocument ? currentDocument.title : "Untitled"
  )
  const [debouncedTitle] = useDebounce(title, 550)

  useEffect(() => {
    console.log("document changed")
  }, [currentDocument.id])

  // When the document title changes elsewhere, update the state here
  useEffect(() => {
    setTitle(currentDocument.title)
  }, [currentDocument.title])

  // Rename document when the title value changes here
  useEffect(() => {
    const newTitle = debouncedTitle.trim() === "" ? "Untitled" : debouncedTitle
    if (currentDocument.title !== newTitle) {
      renameDocument(newTitle)
    }
  }, [currentDocument.title, debouncedTitle, renameDocument])

  const handleSaveDocument: OnKeyDown = async (event: KeyboardEvent) => {
    if (isHotkey("mod+s", event)) {
      event.preventDefault()
      const updatedDocument = saveDocument()
      if (updatedDocument === null) {
        alert("There was a problem while saving the document")
      }
    }
  }

  return (
    <Container>
      <HoveringToolbar />
      <Toolbar />
      {/* <Title /> */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
      />
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

const Title: React.FC<{ documentId: string }> = () => {}

const Container = styled.div`
  margin: 40px auto;
  padding: 20px;
  width: 600px;
  font-size: 20px;
  box-sizing: content-box;
`

export default EditorComponent
