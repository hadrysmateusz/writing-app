import React, { useCallback, useEffect, useState, useMemo } from "react"
import { isEqual } from "lodash"
import { createEditor, Node } from "slate"
import { ReactEditor, Slate } from "slate-react"
import styled from "styled-components/macro"

import { SaveDocumentFn, useMainState } from "../MainProvider"
import { deserialize, serialize } from "../Editor"
import { ImageModalProvider } from "../ImageModal"
import { LinkModalProvider } from "../LinkPrompt"
import { DEFAULT_EDITOR_VALUE, EditorState } from "../Main"

import { applyPlugins } from "../../slate-plugin-system"
import { useDevUtils } from "../../dev-tools"
import { plugins } from "../../pluginsList"
import { withDelayRender } from "../../withDelayRender"
import { createContext } from "../../utils"

const NoEditorState = withDelayRender(1000)(() => <div>No editor object</div>)

export const [EditorStateContext, useEditorState] = createContext<EditorState>()

/**
 * State provider for editor and secondary sidebar
 */
export const EditorStateProvider: React.FC = ({ children }) => {
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

  const editorState = useMemo(
    () => ({
      isModified,
      editorValue,
      resetEditor: createEditorObject,
      saveDocument,
      setIsModified,
      setEditorValue,
    }),
    [createEditorObject, editorValue, isModified, saveDocument]
  )

  return (
    <EditorStateProviderContainer>
      {editor ? (
        <Slate editor={editor} value={editorValue} onChange={onChange}>
          <EditorStateContext.Provider value={editorState}>
            <ImageModalProvider>
              <LinkModalProvider>{children}</LinkModalProvider>
            </ImageModalProvider>
          </EditorStateContext.Provider>
        </Slate>
      ) : (
        <NoEditorState />
      )}
    </EditorStateProviderContainer>
  )
}

// The purpose of this component is to
const EditorStateProviderContainer = styled.div`
  height: 100%;
  > * {
    height: 100%;
  }
`
