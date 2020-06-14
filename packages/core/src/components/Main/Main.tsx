import React, { useMemo } from "react"
import styled from "styled-components/macro"
import { useEditor } from "slate-react"

import { PrimarySidebar } from "../Sidebar"
import { EditorComponent } from "../Editor"
import { useLogEditor, useLogValue } from "../devToolsUtils"

import { useViewState } from "../ViewStateProvider"
import { useEditorState } from "../EditorStateProvider"
import { useMainState } from "../MainStateProvider"
import { NavigatorSidebar } from "../NavigatorSidebar"
import { formatOptional } from "../../utils"

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

  const title = useMemo(() => {
    return currentDocument !== null
      ? formatOptional(currentDocument.title, "Untitled")
      : "Untitled"
  }, [currentDocument])

  return (
    <OuterContainer>
      {isLoading
        ? "Loading..."
        : error ?? (
            <>
              {navigatorSidebar && <NavigatorSidebar />}
              <InnerContainerWrapper>
                <Topbar>{title}</Topbar>
                <InnerContainer>
                  {primarySidebar && <PrimarySidebar />}
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
  display: grid;
  grid-template-columns: 200px 1fr;
  width: 100vw;
  height: 100vh;
  background-color: #1e1e1e;
  color: white;
  font-family: "Segoe UI", "Open sans", "sans-serif";

  --topbar-height: 56px;
`

const InnerContainerWrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: var(--topbar-height) calc(100vh - var(--topbar-height));
  min-height: 0;
  overflow: hidden;
`

const InnerContainer = styled.div`
  min-height: 0;
  height: 100%;
  display: grid;
  grid-template-columns: 280px 1fr;
`

const Topbar = styled.div`
  height: var(--topbar-height);
  width: 100%;
  padding: 10px 20px;
  border-bottom: 1px solid #363636;

  font-family: Poppins;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;

  display: flex;
  align-items: center;

  color: #e4e4e4;
`

export default Main
