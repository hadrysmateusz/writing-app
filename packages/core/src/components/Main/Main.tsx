import React from "react"
import styled from "styled-components/macro"
import { useEditor } from "slate-react"

import { Sidebar } from "../Sidebar"
import { EditorComponent } from "../Editor"
import { useLogEditor, useLogValue } from "../devToolsUtils"

import { useViewState } from "../ViewStateProvider"
import { useEditorState } from "../EditorStateProvider"
import { useMainState } from "../MainStateProvider"

// TODO: consider creating an ErrorBoundary that will select the start of the document if slate throws an error regarding the selection

const Main = () => {
  const { navigatorSidebar, primarySidebar } = useViewState()
  const { editorValue } = useEditorState()
  const { currentDocument, isLoading } = useMainState()
  const editor = useEditor()

  // DevTools utils
  useLogEditor(editor)
  useLogValue(editorValue)

  const error = null // TODO: actual error handling

  return (
    <InnerContainer>
      {isLoading
        ? "Loading..."
        : error ?? (
            <>
              {navigatorSidebar && (
                <div
                  style={{
                    borderRight: "1px solid #383838",
                    background: "#171717",
                  }}
                >
                  navigator
                </div>
              )}
              {primarySidebar && <Sidebar />}
              {currentDocument && (
                <EditorComponent
                  key={currentDocument.id} // Necessary to reload the component on id change
                  currentDocument={currentDocument}
                />
              )}
            </>
          )}
    </InnerContainer>
  )
}

const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: 150px 250px 1fr;
  width: 100vw;
  height: 100vh; /* TODO: this needs to be improved */
  background-color: #1e1e1e;
  color: white;
  font-family: "Segoe UI", "Open sans", "sans-serif";
`

export default Main
