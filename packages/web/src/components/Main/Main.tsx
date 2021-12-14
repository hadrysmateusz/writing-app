import React from "react"
import Split from "react-split-grid"

import { SecondarySidebar } from "../SecondarySidebar"
import { NavigatorSidebar } from "../NavigatorSidebar"
import { PrimarySidebar } from "../PrimarySidebar"
import {
  useNavigatorSidebar,
  usePrimarySidebar,
  useSecondarySidebar,
} from "../ViewState"
import { useSidebar } from "../SidebarCommon"
import { EditorStateProvider } from "../EditorStateProvider"
import { EditorRenderer } from "../Editor"

import { Grid, Gutter } from "./Main.styles"

// TODO: consider creating an ErrorBoundary that will select the start of the document if slate throws an error regarding the selection

// TODO: resizing navigator and primary sidebar can still move content off screen, this is probably because all sidebars are not on  the same grid, I should try moving them to the same grid, and any intermediate wrappers should be logic-only

/**
 * Renders the editor and secondary sidebar in split panes
 */
const EditorAndSecondarySidebar: React.FC = () => {
  const secondarySidebar = useSecondarySidebar()
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
  const primarySidebar = usePrimarySidebar()
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
  const navigatorSidebar = useNavigatorSidebar()
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

export default Main
