import React, { useMemo, useCallback } from "react"
import styled from "styled-components/macro"
import { useEditor } from "slate-react"
import SplitPane from "react-split-pane"
import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd"

import { PrimarySidebar, SecondarySidebar } from "../Sidebar"
import { EditorComponent } from "../Editor"

import { useViewState } from "../View/ViewStateProvider"
import { useEditorState } from "../EditorStateProvider"
import { useMainState } from "../MainProvider"
import { NavigatorSidebar } from "../NavigatorSidebar"
import { Topbar } from "../Topbar"
import { getDefaultSize, setDefaultSize } from "./helpers"
import { useDevUtils } from "../../dev-tools"

// TODO: consider creating an ErrorBoundary that will select the start of the document if slate throws an error regarding the selection

// TODO: consider adding an onChange to split panes that will close them when they get below a certain size

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
  const storageKey = "splitPosNavigator"
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
  const storageKey = "splitPosPrimary"
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
            <InnermostRenderer />
          </SplitPane>
        ) : (
          <InnermostRenderer />
        )}
      </InnerContainer>
    </InnerContainerWrapper>
  )
}

/**
 * Renders the editor and right-side drawer in split panes
 */
const InnermostRenderer: React.FC = () => {
  const { secondarySidebar } = useViewState()
  const storageKey = "splitPosSecondary"
  const defaultSize = useMemo(() => getDefaultSize(storageKey, 280), [])
  const handleChange = useCallback((s) => setDefaultSize(storageKey, s), [])

  return secondarySidebar.isOpen ? (
    <SplitPane
      split="vertical"
      primary="second"
      minSize={200}
      maxSize={800}
      defaultSize={defaultSize}
      onChange={handleChange}
    >
      <EditorRenderer />
      <SecondarySidebar />
    </SplitPane>
  ) : (
    <EditorRenderer />
  )
}

const Main = () => {
  const { editorValue } = useEditorState()
  const { isLoading } = useMainState()
  const editor = useEditor()

  useDevUtils({ value: editorValue, editor })

  const onDragEnd: OnDragEndResponder = useCallback((result) => {
    const { destination, source, draggableId } = result

    alert("TODO: Drag'n'Drop")

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
  }, [])

  const error = null // TODO: actual error handling

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <OuterContainer>
        {/* TODO: loading state handling */}
        {isLoading ? null : error ? error : <OuterRenderer />}
      </OuterContainer>
    </DragDropContext>
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
