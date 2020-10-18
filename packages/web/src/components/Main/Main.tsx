import React, { useCallback, memo, useEffect, useState, useRef } from "react"
import styled, { keyframes } from "styled-components/macro"
import Split from "react-split-grid"
import { isEqual } from "lodash"
import { createEditor, Node } from "slate"
import { ReactEditor, Slate } from "slate-react"
import { History } from "slate-history"
import { useEvent } from "react-use"

import { SecondarySidebar } from "../SecondarySidebar"
import { NavigatorSidebar } from "../NavigatorSidebar"
import { PrimarySidebar } from "../PrimarySidebar"
import { EditorComponent, deserialize, serialize } from "../Editor"
import { useViewState } from "../ViewState"
import { SaveDocumentFn, useMainState } from "../MainProvider"
import { ImageModalProvider } from "../ImageModal"
import { LinkModalProvider } from "../LinkPrompt"

import { withDelayRender } from "../../withDelayRender"
import { applyPlugins } from "../../slate-plugin-system"
import { plugins } from "../../pluginsList"
import { createContext } from "../../utils"
import { useDevUtils } from "../../dev-tools"

import { useSplitPane } from "./helpers"
import { EditorState } from "./types"

// TODO: consider creating an ErrorBoundary that will select the start of the document if slate throws an error regarding the selection

export const [EditorStateContext, useEditorState] = createContext<EditorState>()

export const DEFAULT_EDITOR_VALUE: Node[] = [
  { type: "paragraph", children: [{ text: "" }] },
]
export const DEFAULT_EDITOR_HISTORY: History = { undos: [], redos: [] }

const DocumentLoadingState = withDelayRender(1000)(() => <div>Loading...</div>)

/**
 * Renders the editor if there is a document selected
 */
const EditorRenderer: React.FC<{ saveDocument: SaveDocumentFn }> = ({
  saveDocument,
}) => {
  const { currentDocument, isDocumentLoading, unsyncedDocs } = useMainState()
  const { secondarySidebar } = useViewState()
  const { isModified } = useEditorState()

  return (
    <OuterContainer>
      {isDocumentLoading ? (
        <DocumentLoadingState />
      ) : currentDocument ? (
        <>
          {/* <button
            onClick={() => {
              secondarySidebar.toggle()
            }}
          >
            sidebar
          </button>

          <div>
            {isModified
              ? "MODIFIED"
              : unsyncedDocs.includes(currentDocument.id)
              ? "SAVED & UNREPLICATED"
              : "SYNCED"}
          </div> */}

          <EditorTabsContainer>
            <EditorTab />
          </EditorTabsContainer>

          <EditorComponent
            key={currentDocument.id} // Necessary to reload the component on id change
            currentDocument={currentDocument}
            saveDocument={saveDocument}
          />
        </>
      ) : (
        // This div is here to prevent issues with split pane rendering
        // TODO: add proper empty state
        <div>No document selected</div>
      )}
    </OuterContainer>
  )
}

const getMaxSidebarWidth = () => {
  return (window.innerWidth / 12) * 3
}

const getMaxNavigatorSidebarWidth = () => {
  return (window.innerWidth / 12) * 2
}

/**
 * Renders the editor and secondary sidebar in split panes
 */
const EditorAndSecondarySidebar: React.FC<{ saveDocument: SaveDocumentFn }> = ({
  saveDocument,
}) => {
  const { secondarySidebar } = useViewState()
  const { defaultSize, handleChange } = useSplitPane("splitPosSecondary")
  const [sidebarWidth, setSidebarWidth] = useState<number>(defaultSize)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const sidebarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isDragging) return
    if (secondarySidebar.isOpen && sidebarWidth === 0) {
      console.log("resetting")
      setSidebarWidth(Math.max(200, defaultSize))
    }
  }, [defaultSize, isDragging, secondarySidebar.isOpen, sidebarWidth])

  useEffect(() => {
    if (isDragging) return
    if (!secondarySidebar.isOpen) {
      setSidebarWidth(0)
    }
  }, [isDragging, secondarySidebar.isOpen])

  const handleDrag = useCallback(
    (_direction, _track, style) => {
      const widthWithUnit = style.split(" ")[2]
      const width = widthWithUnit.slice(0, -2)
      setSidebarWidth(Math.min(getMaxSidebarWidth(), width))
      handleChange(width)
    },
    [handleChange]
  )

  return (
    <Split
      minSize={0}
      snapOffset={180}
      gridTemplateColumns={`1fr auto ${Math.min(
        getMaxSidebarWidth(),
        sidebarWidth
      )}px`}
      onDragEnd={() => {
        const newSidebarWidth = sidebarRef?.current?.getBoundingClientRect()
          .width

        if (newSidebarWidth === 0) {
          secondarySidebar.close()
        }

        if (newSidebarWidth !== undefined) {
          setSidebarWidth(Math.min(getMaxSidebarWidth(), newSidebarWidth))
        }

        setIsDragging(false)
      }}
      onDragStart={() => {
        setIsDragging(true)
        secondarySidebar.open()
      }}
      onDrag={handleDrag}
      direction="horizontal"
      cursor="col-resize"
      render={({ getGridProps, getGutterProps }) => (
        <Grid sidebarWidth={sidebarWidth} {...getGridProps()}>
          <div style={{ minWidth: 0 }}>
            <EditorRenderer saveDocument={saveDocument} />
          </div>

          <Gutter {...getGutterProps("column", 1)} />

          <SecondarySidebar ref={sidebarRef} />
        </Grid>
      )}
    />
  )
}

/**
 * State provider for editor and secondary sidebar
 */
const EditorStateProvider: React.FC = () => {
  const { currentDocument } = useMainState()

  const [editorValue, setEditorValue] = useState<Node[]>(DEFAULT_EDITOR_VALUE)
  const [isModified, setIsModified] = useState(false)

  useEffect(() => {
    // TODO: replace defaultEditorValue with null
    const content = currentDocument?.content
      ? deserialize(currentDocument.content)
      : DEFAULT_EDITOR_VALUE

    setEditorValue(content)
  }, [currentDocument])

  // If the editor needs to be accessed above in the react tree, try using some kind of pub/sub / event system. Don't lift this because it will have a huge performance impact
  const [editor, setEditor] = useState<ReactEditor | null>(null)

  const createEditorObject = useCallback(() => {
    let editor = applyPlugins(createEditor(), plugins) as ReactEditor
    setEditor(editor)
  }, [])

  /**
   * Creates the editor object
   */
  useEffect(() => {
    createEditorObject()
  }, [createEditorObject])

  /**
   * onChange event handler for the Slate component
   */
  const onChange = useCallback(
    (value: Node[]) => {
      // TODO: I could debounced-save in here
      setEditorValue(value)

      // if the content has changed, set the modified flag (skip the expensive check if it's already true)
      if (!isModified) {
        setIsModified(!isEqual(editorValue, value))
      }
    },
    [editorValue, isModified]
  )

  /**
   * Save document
   *
   * Works on the current document
   */
  const saveDocument: SaveDocumentFn = useCallback(async () => {
    if (isModified) {
      const updatedDocument =
        (await currentDocument?.atomicUpdate((doc) => {
          doc.content = serialize(editorValue)
          return doc
        })) || null

      setIsModified(false)
      return updatedDocument
    }
    return null
  }, [currentDocument, editorValue, isModified, setIsModified])

  useDevUtils({ value: editorValue, editor })

  return editor ? (
    <Slate editor={editor} value={editorValue} onChange={onChange}>
      <EditorStateContext.Provider
        value={{
          isModified,
          editorValue,
          resetEditor: createEditorObject,
          setIsModified,
          setEditorValue,
        }}
      >
        <ImageModalProvider>
          <LinkModalProvider>
            <EditorAndSecondarySidebar saveDocument={saveDocument} />
          </LinkModalProvider>
        </ImageModalProvider>
      </EditorStateContext.Provider>
    </Slate>
  ) : (
    <div>No editor object</div>
  )
}

/**
 * Renders the primary sidebar and the rest of the editor in split panes
 */
const InnerSidebarsAndEditor: React.FC = () => {
  const { primarySidebar } = useViewState()

  const { defaultSize, handleChange } = useSplitPane("splitPosPrimary")
  const [sidebarWidth, setSidebarWidth] = useState<number>(defaultSize)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  // useEffect(() => {
  //   handleChange(300)
  // }, [])

  useEffect(() => {
    if (isDragging) return
    if (primarySidebar.isOpen && sidebarWidth === 0) {
      console.log("resetting")
      setSidebarWidth(Math.max(200, defaultSize))
    }
  }, [defaultSize, isDragging, primarySidebar.isOpen, sidebarWidth])

  useEffect(() => {
    if (isDragging) return
    if (!primarySidebar.isOpen) {
      setSidebarWidth(0)
    }
  }, [isDragging, primarySidebar.isOpen])

  const handleDrag = useCallback(
    (_direction, _track, style) => {
      const widthWithUnit = style.split(" ")[0]
      const width = widthWithUnit.slice(0, -2)
      setSidebarWidth(Math.min(getMaxSidebarWidth(), width))
      handleChange(width)
    },
    [handleChange]
  )

  return (
    <Split
      minSize={0}
      snapOffset={180}
      gridTemplateColumns={`${Math.min(
        getMaxSidebarWidth(),
        sidebarWidth
      )}px auto 1fr`}
      onDragEnd={() => {
        const newSidebarWidth = sidebarRef?.current?.getBoundingClientRect()
          .width

        if (newSidebarWidth === 0) {
          primarySidebar.close()
        }

        if (newSidebarWidth !== undefined) {
          setSidebarWidth(Math.min(getMaxSidebarWidth(), newSidebarWidth))
        }

        setIsDragging(false)
      }}
      onDragStart={() => {
        setIsDragging(true)
        primarySidebar.open()
      }}
      onDrag={handleDrag}
      direction="horizontal"
      cursor="col-resize"
      render={({ getGridProps, getGutterProps }) => (
        <Grid sidebarWidth={sidebarWidth} {...getGridProps()}>
          <PrimarySidebar ref={sidebarRef} />

          <Gutter {...getGutterProps("column", 1)} />

          <div style={{ minWidth: 0 }}>
            <EditorStateProviderContainer>
              <EditorStateProvider />
            </EditorStateProviderContainer>
          </div>
        </Grid>
      )}
    />
  )
}

/**
 * Renders the navigator sidebar and the rest of the editor in split panes
 */

const Main = memo(() => {
  const { isLoading } = useMainState()
  const { navigatorSidebar } = useViewState()

  const { defaultSize, handleChange } = useSplitPane("splitPosNavigator")

  const [sidebarWidth, setSidebarWidth] = useState<number>(defaultSize)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {}, [])

  useEvent("resize", () => {
    console.log("resize")
  })

  useEffect(() => {
    handleChange(200)
    navigatorSidebar.open()
  }, [])

  useEffect(() => {
    if (isDragging) return
    if (navigatorSidebar.isOpen && sidebarWidth === 0) {
      console.log("resetting")
      setSidebarWidth(Math.max(200, defaultSize))
    }
  }, [defaultSize, isDragging, navigatorSidebar.isOpen, sidebarWidth])

  useEffect(() => {
    if (isDragging) return
    if (!navigatorSidebar.isOpen) {
      setSidebarWidth(0)
    }
  }, [isDragging, navigatorSidebar.isOpen])

  const handleDrag = useCallback(
    (_direction, _track, style) => {
      const widthWithUnit = style.split(" ")[0]
      const width = widthWithUnit.slice(0, -2)
      setSidebarWidth(Math.min(getMaxNavigatorSidebarWidth(), width))
      handleChange(width)
    },
    [handleChange]
  )

  const error = null // TODO: actual error handling

  return (
    <>
      {/* TODO: loading state handling */}
      {isLoading ? (
        <AppLoadingContainer>
          <AppLoadingIndicator />
        </AppLoadingContainer>
      ) : error ? (
        error || "Error"
      ) : (
        <Split
          minSize={0}
          snapOffset={20}
          gridTemplateColumns={` ${Math.min(
            getMaxNavigatorSidebarWidth(),
            sidebarWidth
          )}px auto 1fr`}
          onDragEnd={() => {
            const newSidebarWidth = sidebarRef?.current?.getBoundingClientRect()
              .width

            if (newSidebarWidth === 0) {
              navigatorSidebar.close()
            }

            if (newSidebarWidth !== undefined) {
              setSidebarWidth(
                Math.min(getMaxNavigatorSidebarWidth(), newSidebarWidth)
              )
            }

            setIsDragging(false)
          }}
          onDragStart={() => {
            setIsDragging(true)
            navigatorSidebar.open()
          }}
          onDrag={handleDrag}
          direction="horizontal"
          cursor="col-resize"
          render={({ getGridProps, getGutterProps }) => (
            <Grid sidebarWidth={sidebarWidth} {...getGridProps()}>
              <NavigatorSidebar ref={sidebarRef} />

              <Gutter {...getGutterProps("column", 1)} />

              <div style={{ minWidth: 0 }}>
                <InnerSidebarsAndEditor />
              </div>
            </Grid>
          )}
        />
      )}
    </>
  )
})

const OuterContainer = styled.div`
  min-height: 0;
  height: 100%;
  display: grid;
  grid-template-rows: var(--tab-size) 1fr;
`

const breathingColor = keyframes`
  from { color: #999999; }
	to { color: #f6f6f6; }
`

const AppLoadingIndicator = withDelayRender(1000)(() => <div>Loading</div>)

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

const EditorStateProviderContainer = styled.div`
  height: 100%;
  > * {
    height: 100%;
  }
`

const EditorTabsContainer = styled.div`
  background: var(--bg-100);
  height: var(--tab-size);
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: start;
`

const EditorTab = styled.div`
  width: 150px;
  height: var(--tab-size);
  background: var(--bg-200);
  border-radius: var(--tab-corner-radius) var(--tab-corner-radius) 0 0;
`

const Grid = styled.div`
  display: grid;
  min-width: 0;
  height: 100%;
`

const Gutter = styled.div`
  width: 10px;
  margin: 0 -5px;
  border-left: 5px solid rgba(0, 0, 0, 0);
  border-right: 5px solid rgba(0, 0, 0, 0);
  cursor: col-resize;
  z-index: 1;
  box-sizing: border-box;
  background-clip: padding-box;

  transition: border-color 1s ease;

  :hover {
    border-left: 5px solid rgba(0, 0, 0, 0.15);
    border-right: 5px solid rgba(0, 0, 0, 0.15);
  }
`

export default Main
