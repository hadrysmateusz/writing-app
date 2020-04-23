import React from "react"
import styled from "styled-components/macro"
import { API } from "aws-amplify"

import { Slate, ReactEditor } from "slate-react"
import { useCreateEditor } from "@slate-plugin-system/core"

import { plugins } from "../../editorConfig"
import { useLogEditor, useLogValue } from "../devToolsUtils"
import { useSlateState } from "../../hooks/useSlateState"
import { Sidebar } from "../Sidebar"
import { Editor } from "../Editor"

const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  width: 100vw;
`

const Main = () => {
  const editor = useCreateEditor(plugins) as ReactEditor
  const [value, onChange] = useSlateState()

  // DevTools utils
  useLogEditor(editor)
  useLogValue(value)

  const saveDocument = async () => {
    // TODO: I need to determine if the document is new on the client-side and choose to either create or update based on that (I could also take the local/cloud nature of the document into consideration)
    // TODO: add progress and error states
    try {
      const title = prompt("Title")
      await API.post("documents", "/documents", {
        body: {
          content: JSON.stringify(value),
          title: title,
        },
      })
      alert("Saved")
    } catch (error) {
      console.error(error)
      alert("Error while saving")
    }
  }

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <InnerContainer>
        <Sidebar />
        <Editor saveDocument={saveDocument} />
      </InnerContainer>
    </Slate>
  )
}

export default Main
