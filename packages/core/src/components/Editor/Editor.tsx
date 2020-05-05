import React, { KeyboardEvent } from "react"
import styled from "styled-components/macro"
import { Editable, OnKeyDown } from "@slate-plugin-system/core"

import { plugins } from "../../pluginsList"
import { Toolbar } from "../Toolbar"
import HoveringToolbar from "../HoveringToolbar"
import { EditableContainer } from "./styledComponents"
import isHotkey from "is-hotkey"
import { Document } from "models"

const EditorComponent: React.FC<{
  saveDocument: () => Promise<Document | null>
}> = ({ saveDocument }) => {
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

export default EditorComponent
