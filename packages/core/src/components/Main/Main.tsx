import React, { useMemo, useCallback, memo, useEffect, useState } from "react"
import styled from "styled-components/macro"
import SplitPane from "react-split-pane"

import { PrimarySidebar, SecondarySidebar } from "../Sidebar"
import { EditorComponent } from "../Editor"

import { useViewState } from "../View/ViewStateProvider"
import { SaveDocumentFn, useMainState } from "../MainProvider"
import { NavigatorSidebar } from "../NavigatorSidebar"
import { Topbar } from "../Topbar"
import { getDefaultSize, setDefaultSize } from "./helpers"
import { withDelayRender } from "../../withDelayRender"
import { serialize } from "../Editor/serialization"

import { isEqual } from "lodash"
import { createEditor, Node } from "slate"
import { ReactEditor, Slate } from "slate-react"

import { plugins } from "../../pluginsList"
import { applyPlugins } from "../../slate-plugin-system"
import { createContext } from "../../utils"
import { useDevUtils } from "../../dev-tools"
import { History } from "slate-history"
import { deserialize } from "../Editor/serialization"
import { ImageModalProvider } from "../ImageModal"
import { LinkModalProvider } from "../LinkPrompt"

export type EditorState = {
  editorValue: Node[]
  isModified: boolean
  resetEditor: () => void
  setEditorValue: React.Dispatch<React.SetStateAction<Node[]>>
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>
}

// TODO: consider creating an ErrorBoundary that will select the start of the document if slate throws an error regarding the selection
// TODO: consider adding an onChange to split panes that will close them when they get below a certain size

const LoadingState = withDelayRender(1000)(() => <div>Loading...</div>)

export const [useEditorState, _, EditorStateContext] = createContext<
  EditorState
>()

export const DEFAULT_EDITOR_VALUE: Node[] = [
  { type: "paragraph", children: [{ text: "" }] },
]
export const DEFAULT_EDITOR_HISTORY: History = { undos: [], redos: [] }

/**
 * Renders the editor if there is a document selected
 */
const EditorRenderer: React.FC<{ saveDocument: SaveDocumentFn }> = ({
  saveDocument,
}) => {
  const { currentDocument, isDocumentLoading } = useMainState()

  return isDocumentLoading ? (
    <LoadingState />
  ) : currentDocument ? (
    <EditorComponent
      key={currentDocument.id} // Necessary to reload the component on id change
      currentDocument={currentDocument}
      saveDocument={saveDocument}
    />
  ) : (
    // This div is here to prevent issues with split pane rendering
    // TODO: add proper empty state
    <div>No document selected</div>
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
      {/* <Topbar /> */}
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

const InnermosterRenderer: React.FC = ({ saveDocument }) => {
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
      <EditorRenderer saveDocument={saveDocument} />
      <SecondarySidebar />
    </SplitPane>
  ) : (
    <EditorRenderer saveDocument={saveDocument} />
  )
}

/**
 * Renders the editor and right-side drawer in split panes
 */
const InnermostRenderer: React.FC = () => {
  const { currentDocument } = useMainState()

  const [editorValue, setEditorValue] = useState<Node[]>(DEFAULT_EDITOR_VALUE)

  const [isModified, setIsModified] = useState(false)

  // useDevUtils({ value: editorValue, editor })

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
    console.log("creating new editor")
    let editor = applyPlugins(createEditor(), plugins) as ReactEditor
    console.log("created new editor", editor)

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
      // console.log("setting editor value to", value)

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
            <InnermosterRenderer saveDocument={saveDocument} />
          </LinkModalProvider>
        </ImageModalProvider>
      </EditorStateContext.Provider>
    </Slate>
  ) : null
}

const Main = memo(() => {
  const { isLoading } = useMainState()

  const error = null // TODO: actual error handling

  return (
    <OuterContainer>
      {/* TODO: loading state handling */}
      {isLoading ? null : error ? error : <OuterRenderer />}
    </OuterContainer>
  )
})

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
  /* display: grid;
  grid-template-rows: var(--topbar-height) calc(100vh - var(--topbar-height)); */
  min-height: 0;
  overflow: hidden;
`

const InnerContainer = styled.div`
  min-height: 0;
  height: 100%;
  position: relative;
`

export default Main
