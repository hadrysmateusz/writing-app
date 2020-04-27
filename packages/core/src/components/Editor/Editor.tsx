import React from "react"
import styled from "styled-components/macro"
import { Editable } from "@slate-plugin-system/core"

import { plugins } from "../../editorConfig"
import { Toolbar } from "../Toolbar"
import HoveringToolbar from "../HoveringToolbar"
import { EditableContainer } from "./styledComponents"

function EditorComponent(/* { saveDocument }: { saveDocument: () => void } */) {
  return (
    <Container>
      {/* <button onClick={() => saveDocument()}>Save</button> */}
      <HoveringToolbar />
      <Toolbar />
      <EditableContainer>
        <Editable plugins={plugins} autoFocus spellCheck={false} />
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
