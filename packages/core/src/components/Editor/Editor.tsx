import React from "react"
import { Slate } from "slate-react"
import { Editable, useCreateEditor } from "@slate-plugin-system/core"

import { plugins } from "./editorConfig"
import { Toolbar } from "./Toolbar"
import { useLogEditor, useLogValue } from "../devToolsUtils"
import HoveringToolbar from "../HoveringToolbar"
import { EditableContainer } from "./styledComponents"
import { useSlateState } from "./useSlateState"
import { Authenticate } from "../Authenticate"

function EditorComponent() {
  const editor = useCreateEditor(plugins)
  const [value, onChange] = useSlateState()

  // DevTools utils
  useLogEditor(editor)
  useLogValue(value)

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Authenticate />
      <HoveringToolbar />
      <Toolbar />
      <EditableContainer>
        <Editable plugins={plugins} autoFocus spellCheck={false} />
      </EditableContainer>
    </Slate>
  )
}

export default EditorComponent
