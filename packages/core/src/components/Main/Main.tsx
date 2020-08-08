import React, { useMemo, useCallback } from "react"
import styled from "styled-components/macro"
import { useEditor } from "slate-react"
import SplitPane from "react-split-pane"

import { PrimarySidebar } from "../Sidebar"
import { EditorComponent } from "../Editor"
import { useLogEditor, useLogValue } from "../devToolsUtils"

import { useViewState } from "../View/ViewStateProvider"
import { useEditorState } from "../EditorStateProvider"
import { useMainState } from "../MainProvider"
import { NavigatorSidebar } from "../NavigatorSidebar"
import { Topbar } from "../Topbar"
import { getDefaultSize, setDefaultSize } from "./helpers"

// TODO: consider creating an ErrorBoundary that will select the start of the document if slate throws an error regarding the selection

/**
 * Renders the editor if there is a document selected
 */
const EditorRenderer: React.FC = () => {
  const { currentDocument } = useMainState()

  return currentDocument ? (
    <EditorComponent
      key={currentDocument.id} // Necessary to reload the component on id change
      currentDocument={currentDocument}
    />
  ) : (
    // This div is here to prevent issues with split pane rendering
    <div />
  )
}

/**
 * Renders the navigator sidebar and the rest of the editor in split panes
 */
const OuterRenderer: React.FC = () => {
  const { navigatorSidebar } = useViewState()
  const storageKey = "splitPosOuter"
  const defaultSize = useMemo(() => getDefaultSize(storageKey, 200), [])
  const handleChange = useCallback((s) => setDefaultSize(storageKey, s), [])

  return navigatorSidebar.isOpen ? (
    <SplitPane
      split="vertical"
      minSize={170}
      maxSize={400}
      defaultSize={defaultSize}
      onChange={handleChange}
    >
      <NavigatorSidebar />
      <InnerRenderer />
    </SplitPane>
  ) : (
    <InnerRenderer />
  )
}

/**
 * Renders the topbar, primary sidebar and the rest of the editor in split panes
 */
const InnerRenderer: React.FC = () => {
  const { primarySidebar } = useViewState()
  const storageKey = "splitPosInner"
  const defaultSize = useMemo(() => getDefaultSize(storageKey, 280), [])
  const handleChange = useCallback((s) => setDefaultSize(storageKey, s), [])

  return (
    <InnerContainerWrapper>
      <Topbar />
      <InnerContainer>
        {primarySidebar.isOpen ? (
          <SplitPane
            split="vertical"
            minSize={200}
            maxSize={800}
            defaultSize={defaultSize}
            onChange={handleChange}
          >
            <PrimarySidebar />
            <EditorRenderer />
          </SplitPane>
        ) : (
          <EditorRenderer />
        )}
      </InnerContainer>
    </InnerContainerWrapper>
  )
}

const Main = () => {
  const { editorValue } = useEditorState()
  const { isLoading } = useMainState()
  const editor = useEditor()

  // DevTools utils
  useLogEditor(editor)
  useLogValue(editorValue)

  const error = null // TODO: actual error handling

  return (
    <OuterContainer>
      {/* TODO: loading state handling */}
      {isLoading ? null : error ? error : <OuterRenderer />}
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
  position: relative;
`

export default Main
