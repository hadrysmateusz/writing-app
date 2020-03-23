import React, { useState, useCallback } from "react"
import { Slate } from "slate-react"
import { withHistory } from "slate-history"
import styled from "styled-components"

import { Editable, useCreateEditor } from "@slate-plugin-system/core"

import {
  LoggerPlugin,
  InlineCodePlugin,
  LinkPlugin,
  HeadingsPlugin,
  BlockquotePlugin,
  CodeBlockPlugin,
  BoldPlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  ListPlugin,
  MarkdownShortcutsPlugin,
  toggleList,
  ListType
} from "../../slate-plugins"
import { Toolbar } from "./Toolbar"
import { serialize, deserialize } from "./serialization"
import { useLogEditor, useLogValue } from "./devToolsUtils"
import HoveringToolbar from "./HoveringToolbar"
// import { SuperPowers } from "./SuperPowers"

function loadFromLocalStorage() {
  return deserialize(localStorage.getItem("content") || "")
}

const plugins = [
  { editorOverrides: withHistory },
  LoggerPlugin(),
  BoldPlugin({ hotkey: "mod+b" }),
  ItalicPlugin({ hotkey: "mod+i" }),
  StrikethroughPlugin({ hotkey: "mod+shift+k" }),
  InlineCodePlugin({ hotkey: "mod+e" }),
  LinkPlugin(),
  BlockquotePlugin(),
  CodeBlockPlugin(),
  ListPlugin(),
  MarkdownShortcutsPlugin({
    onToggleOverrides: { [ListType.UL_LIST]: toggleList, [ListType.OL_LIST]: toggleList }
  }),
  HeadingsPlugin({ levels: 6 })
]

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
