import React from "react"
import { Slate } from "slate-react"
import styled from "styled-components/macro"
import { Editable, useCreateEditor } from "@slate-plugin-system/core"

import { plugins } from "./editorConfig"
import { Toolbar } from "./Toolbar"
import { useLogEditor, useLogValue } from "../devToolsUtils"
import HoveringToolbar from "../HoveringToolbar"
import { EditableContainer } from "./styledComponents"
import { useSlateState } from "./useSlateState"

function EditorComponent() {
  const editor = useCreateEditor(plugins)
  const [value, onChange] = useSlateState()

  // DevTools utils
  useLogEditor(editor)
  useLogValue(value)

  const save = () => {
    alert("saving")
  }

  return (
    <Container>
      <Slate editor={editor} value={value} onChange={onChange}>
        <button onClick={() => save()}>Save</button>
        <HoveringToolbar />
        <Toolbar />
        <EditableContainer>
          <Editable plugins={plugins} autoFocus spellCheck={false} />
        </EditableContainer>
      </Slate>
    </Container>
  )
}

const Container = styled.div`
  margin: 40px auto;
  padding: 20px;
  max-width: 600px;
  font-size: 20px;
  box-sizing: content-box;
`

export default EditorComponent
