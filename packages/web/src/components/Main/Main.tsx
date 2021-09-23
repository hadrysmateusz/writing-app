import React, { memo } from "react"
import styled, { keyframes, css } from "styled-components/macro"
import Split from "react-split-grid"
import { Descendant } from "slate"
import { History } from "slate-history"

import { SecondarySidebar } from "../SecondarySidebar"
import { NavigatorSidebar } from "../NavigatorSidebar"
import { PrimarySidebar } from "../PrimarySidebar"
import { useViewState } from "../ViewState"
import { useMainState } from "../MainProvider"
import { useSidebar } from "../SidebarCommon"
import { EditorStateProvider } from "../EditorStateProvider"

import { withDelayRender } from "../../withDelayRender"
import { EditorRenderer } from "../Editor/Editor"

// TODO: consider creating an ErrorBoundary that will select the start of the document if slate throws an error regarding the selection

// TODO: resizing navigator and primary sidebar can still move content off screen, this is probably because all sidebars are not on  the same grid, I should try moving them to the same grid, and any intermediate wrappers should be logic-only

export const DEFAULT_EDITOR_VALUE: Descendant[] = [
  { type: "paragraph", children: [{ text: "" }] },
]
export const DEFAULT_EDITOR_HISTORY: History = { undos: [], redos: [] }

const AppLoadingIndicator = withDelayRender(1000)(() => <div>Loading</div>)
const AppLoadingState = () => (
  <AppLoadingContainer>
    <AppLoadingIndicator />
  </AppLoadingContainer>
)

/**
 * Renders the editor and secondary sidebar in split panes
 */
const EditorAndSecondarySidebar: React.FC = () => {
  const { secondarySidebar } = useViewState()
  const { getSplitProps, ref, width, isDragging } = useSidebar(secondarySidebar)

  return (
    <EditorStateProvider>
      <Split
        {...getSplitProps()}
        render={({ getGridProps, getGutterProps }) => (
          <Grid sidebarWidth={width} {...getGridProps()}>
            <EditorRenderer />
            <Gutter
              {...getGutterProps("column", 1)}
              isSidebarOpen={secondarySidebar.isOpen}
              isDragging={isDragging}
            />
            <SecondarySidebar ref={ref} />
          </Grid>
        )}
      />
    </EditorStateProvider>
  )
}

/**
 * Renders the primary sidebar and the (editor + secondary sidebar) in split panes
 */
const InnerSidebarsAndEditor: React.FC = () => {
  const { primarySidebar } = useViewState()
  const { getSplitProps, ref, width, isDragging } = useSidebar(primarySidebar)

  return (
    <Split
      {...getSplitProps()}
      render={({ getGridProps, getGutterProps }) => (
        <Grid sidebarWidth={width} {...getGridProps()}>
          <PrimarySidebar ref={ref} />
          <Gutter
            {...getGutterProps("column", 1)}
            isSidebarOpen={primarySidebar.isOpen}
            isDragging={isDragging}
          />
          <EditorAndSecondarySidebar />
        </Grid>
      )}
    />
  )
}

/**
 * Renders the navigator sidebar and everything else in split panes
 */
const NavigatorSidebarAndRest: React.FC = () => {
  const { navigatorSidebar } = useViewState()
  const { getSplitProps, ref, width, isDragging } = useSidebar(navigatorSidebar)

  return (
    <Split
      {...getSplitProps()}
      render={({ getGridProps, getGutterProps }) => (
        <Grid sidebarWidth={width} {...getGridProps()}>
          <NavigatorSidebar ref={ref} />
          <Gutter
            {...getGutterProps("column", 1)}
            isSidebarOpen={navigatorSidebar.isOpen}
            isDragging={isDragging}
          />
          <InnerSidebarsAndEditor />
        </Grid>
      )}
    />
  )
}

const Main = memo(() => {
  const { isLoading } = useMainState()
  const error = null // TODO: actual error handling

  return isLoading ? (
    <AppLoadingState />
  ) : error ? (
    <div>{error || "Error"}</div>
  ) : (
    <NavigatorSidebarAndRest />
  )
})

const breathingColor = keyframes`
  from { color: #999999; }
	to { color: #f6f6f6; }
`

const AppLoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  background: var(--bg-200);
  text-transform: uppercase;
  font: 500 40px Poppins;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: alternate 1.5s infinite ${breathingColor};
`

const Grid = styled.div`
  display: grid;
  min-width: 0;
  min-height: 0;
  height: 100%;
`

const Gutter = styled.div<{ isSidebarOpen: boolean; isDragging: boolean }>`
  height: 100%;

  transition: border-color 1s ease;
  z-index: 1;
  box-sizing: border-box;
  background-clip: padding-box;
  width: 0;

  /* TODO: better hover / dragging styles */
  ${(p) =>
    p.isSidebarOpen &&
    css`
      width: 10px;
      margin: 0 -5px;
      cursor: col-resize;
      border-left: 5px solid;
      border-right: 5px solid;
      border-color: ${p.isDragging
        ? `rgba(0, 0, 0, 0.15)`
        : `rgba(0, 0, 0, 0)`};

      :hover {
        border-color: rgba(0, 0, 0, 0.15);
      }
    `}
`

export default Main
