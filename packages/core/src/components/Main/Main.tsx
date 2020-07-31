import React from "react"
import styled from "styled-components/macro"
import { useEditor } from "slate-react"

import { PrimarySidebar } from "../Sidebar"
import { EditorComponent } from "../Editor"
import { useLogEditor, useLogValue } from "../devToolsUtils"

import { useViewState } from "../View/ViewStateProvider"
import { useEditorState } from "../EditorStateProvider"
import { useMainState } from "../MainProvider"
import { NavigatorSidebar } from "../NavigatorSidebar"
import { Topbar } from "../Topbar"

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
    <OuterContainer>
      {isLoading
        ? "Loading..."
        : error ?? (
            <>
              {navigatorSidebar.isOpen && <NavigatorSidebar />}
              <InnerContainerWrapper>
                <Topbar />
                <InnerContainer>
                  {primarySidebar.isOpen && <PrimarySidebar />}
                  {currentDocument && (
                    <EditorComponent
                      key={currentDocument.id} // Necessary to reload the component on id change
                      currentDocument={currentDocument}
                    />
                  )}
                </InnerContainer>
              </InnerContainerWrapper>
            </>
          )}
    </OuterContainer>
  )
}

const OuterContainer = styled.div`
  background-color: #1e1e1e;
  color: white;
  font-family: "Segoe UI", "Open sans", "sans-serif";

  display: flex;
  min-height: 0;
  height: 100%;
  width: 100vw;

  --topbar-height: 56px;
`

const InnerContainerWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: var(--topbar-height) calc(100vh - var(--topbar-height));
  min-height: 0;
  overflow: hidden;
`

const InnerContainer = styled.div`
  min-height: 0;
  height: 100%;
  display: flex;
`

export default Main
