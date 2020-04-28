import React, { useState, useCallback, useMemo } from "react"
import styled from "styled-components/macro"
import { Node, createEditor, Editor } from "slate"
import { DataStore } from "aws-amplify"
import { Slate, ReactEditor, withReact } from "slate-react"

import { SlatePlugin } from "@slate-plugin-system/core"

import { plugins } from "../../editorConfig"
import { useLogEditor, useLogValue } from "../devToolsUtils"
import { Sidebar } from "../Sidebar"
import { EditorComponent } from "../Editor"
import { useAsyncEffect } from "../../hooks"
import { deserialize } from "../Editor/serialization"
import { Document } from "../../models"

const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  width: 100vw;
`

export type SwitchEditor = (documentId: string) => void

export const defaultState = [{ type: "paragraph", children: [{ text: "" }] }]

const initialize = () => {
  return defaultState
  // return loadFromLocalStorage()
}

const Main = () => {
  // currently selected editor - represented by the document id
  const [currentEditor, setCurrentEditor] = useState<string | null>(null)

  // content of the currently selected editor
  const [content, setContent] = useState<Node[]>(initialize())

  /**
   * Switch the current editor based on the id of the document in it
   * @param documentId id of the document open in the editor you want to switch to
   */
  const switchEditor: SwitchEditor = useCallback((documentId) => {
    // TODO: maybe save the state of the editor (children, history, selection)
    setCurrentEditor(documentId)
  }, [])

  /**
   * onChange event handler for the Slate component
   */
  const onChange = useCallback((value: Node[]) => {
    setContent(value)
  }, [])

  // Handle changing all of the state and side-effects of switching editors
  useAsyncEffect(async () => {
    console.log("switched editor", currentEditor)
    if (currentEditor === null) {
      setContent(defaultState)
      return
    }

    try {
      // only get the first document (it should be the only one)
      const [document] = await DataStore.query(Document, (c) => c.id("eq", currentEditor))
      const content = document.content ? deserialize(document.content) : defaultState
      setContent(content)
      // TODO: save history to be restored later
      // reset history
      editor.history = { undos: [], redos: [] }
    } catch (error) {
      // TODO: better handle error (show error state)
      setContent(defaultState)
      throw error
    }
  }, [currentEditor])

  const applyPlugins = (editor: Editor, plugins: SlatePlugin[]): Editor => {
    // we reverse the array to execute functions from right to left
    plugins.reverse().forEach((plugin) => {
      if (plugin.editorOverrides) {
        editor = plugin.editorOverrides(editor)
      }
    })
    return editor
  }

  const editor = useMemo(() => {
    let editor = withReact(createEditor()) as Editor
    editor = applyPlugins(editor, plugins)
    return editor
  }, []) as ReactEditor

  // DevTools utils
  useLogEditor(editor)
  useLogValue(content)

  return (
    <Slate editor={editor} value={content} onChange={onChange}>
      <InnerContainer>
        <Sidebar
          switchEditor={switchEditor}
          currentEditor={currentEditor}
          currentContent={content}
        />
        <EditorComponent />
      </InnerContainer>
    </Slate>
  )
}

export default Main
