import React from "react"
import styled, { css } from "styled-components/macro"
import Split from "react-split-grid"

import { SecondarySidebar } from "../SecondarySidebar"
import { NavigatorSidebar } from "../NavigatorSidebar"
import { PrimarySidebar } from "../PrimarySidebar"
import { useViewState } from "../ViewState"
import { useSidebar } from "../SidebarCommon"
import { EditorStateProvider } from "../EditorStateProvider"

import { EditorRenderer } from "../Editor/Editor"

// TODO: consider creating an ErrorBoundary that will select the start of the document if slate throws an error regarding the selection

// TODO: resizing navigator and primary sidebar can still move content off screen, this is probably because all sidebars are not on  the same grid, I should try moving them to the same grid, and any intermediate wrappers should be logic-only

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
const Main: React.FC = () => {
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

  /* --active-border-color: var(--dark-500); */

  ${(p) =>
    p.isSidebarOpen &&
    css`
      width: 4px;
      margin: 0 -2px;
      cursor: col-resize;
      border-left: 2px solid;
      border-right: 2px solid;
      border-color: transparent;

      /* border-color: ${
        p.isDragging ? `var(--active-border-color)` : `rgba(0, 0, 0, 0)`
      }; */
      /* 
      :hover {
        border-color: var(--active-border-color);
      } */
    `}
`

export default Main
