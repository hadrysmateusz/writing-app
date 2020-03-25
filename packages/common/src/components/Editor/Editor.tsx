import React, { useState, useCallback } from "react"
import { Slate } from "slate-react"
import styled from "styled-components"

import { Editable, useCreateEditor } from "@slate-plugin-system/core"

import { plugins } from "./editorConfig"
import { Toolbar } from "./Toolbar"
import { serialize, deserialize } from "./serialization"
import { useLogEditor, useLogValue } from "../devToolsUtils"
import HoveringToolbar from "../HoveringToolbar"
// import { SuperPowers } from "./SuperPowers"

function loadFromLocalStorage() {
  return deserialize(localStorage.getItem("content") || "")
}

const EditableContainer = styled.div`
  margin: 20px 0;
  font-family: "IBM Plex Mono";
  font-size: 16px;
  line-height: 24px;
`

function EditorComponent() {
  const [value, setValue] = useState(loadFromLocalStorage())
  const editor = useCreateEditor(plugins)

  // DevTools utils
  useLogEditor(editor)
  useLogValue(value)

  const onChange = useCallback((value) => {
    setValue(value)
    localStorage.setItem("content", serialize(value))
  }, [])

  return (
    <div>
      {/* <SuperPowers /> */}
      <Slate editor={editor} value={value} onChange={onChange}>
        <HoveringToolbar />
        <Toolbar />
        <EditableContainer>
          <Editable plugins={plugins} autoFocus spellCheck={false} />
        </EditableContainer>
      </Slate>
    </div>
  )
}

export default EditorComponent
