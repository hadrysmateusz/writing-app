import React from "react"
import { Slate, ReactEditor } from "slate-react"
import styled from "styled-components/macro"
import { Editable, useCreateEditor } from "@slate-plugin-system/core"
import { API } from "aws-amplify"

import { plugins } from "./editorConfig"
import { Toolbar } from "./Toolbar"
import { useLogEditor, useLogValue } from "../devToolsUtils"
import HoveringToolbar from "../HoveringToolbar"
import { EditableContainer } from "./styledComponents"
import { useSlateState } from "./useSlateState"

function EditorComponent() {
  const editor = useCreateEditor(plugins) as ReactEditor
  const [value, onChange] = useSlateState()

  // DevTools utils
  useLogEditor(editor)
  useLogValue(value)

  const save = async () => {
    // TODO: I need to determine if the document is new on the client-side and choose to either create or update based on that (I could also take the local/cloud nature of the document into consideration)
    // TODO: add progress and error states
    try {
      const title = prompt("Title")
      await API.post("documents", "/documents", {
        body: {
          content: JSON.stringify(value),
          title: title
        },
      })
      alert("Saved")
    } catch (error) {
      console.error(error)
      alert("Error while saving")
    }
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
