import React from "react"
import styled from "styled-components/macro"

import { Slate, ReactEditor } from "slate-react"
import { useCreateEditor } from "@slate-plugin-system/core"

import { plugins } from "../../editorConfig"
import { useLogEditor, useLogValue } from "../devToolsUtils"
import { useSlateState } from "../../hooks/useSlateState"
import { Sidebar } from "../Sidebar"
import { Editor } from "../Editor"

const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  width: 100vw;
`

const Main = () => {
  const editor = useCreateEditor(plugins) as ReactEditor
  const [value, onChange] = useSlateState()

  // DevTools utils
  useLogEditor(editor)
  useLogValue(value)

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <InnerContainer>
        <Sidebar />
        <Editor />
      </InnerContainer>
    </Slate>
  )
}

export default Main
