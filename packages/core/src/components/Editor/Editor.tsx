import React, { KeyboardEvent, useState, useRef, useEffect } from "react"
import { Editable, OnKeyDown } from "@slate-plugin-system/core"
import isHotkey from "is-hotkey"
import { cloneDeep } from "lodash"

import { plugins } from "../../pluginsList"
import { Toolbar } from "../Toolbar"
import HoveringToolbar from "../HoveringToolbar"
import {
  EditableContainer,
  Container,
  TitleInput,
  InsertBlockField,
} from "./styledComponents"
import { Document } from "models"
import { useEditor, ReactEditor } from "slate-react"
import { Transforms, Path, Editor } from "slate"

const EditorComponent: React.FC<{
  saveDocument: () => Promise<Document | null>
  renameDocument: (title: string) => Promise<Document | null>
  currentDocument: Document
}> = ({ saveDocument, renameDocument, currentDocument }) => {
  const [title, setTitle] = useState<string>(currentDocument.title)
  const titleRef = useRef<HTMLInputElement | null>(null)
  const editor = useEditor()

  // // When the document title changes elsewhere, update the state here
  // useEffect(() => {
  //   setTitle(currentDocument.title)
  // }, [currentDocument.title, setTitle])

  /**
   * Focus the correct element on mount
   */
  useEffect(() => {
    // don't focus content because it can lead to issues if and is not very intuitive (maybe focus the end)
    if (title === "") {
      titleRef.current?.focus()
    }
    // eslint-disable-next-line
  }, [])

  const handleSaveDocument: OnKeyDown = async (event: KeyboardEvent) => {
    if (isHotkey("mod+s", event)) {
      event.preventDefault()
      await saveDocument()
    }
  }

  const handleContentBlur = async () => {
    // TODO: if you close the window or reload without clicking on something else the blur doesn't trigger and the content doesn't get saved
    await saveDocument()
  }

  const handleTitleBlur = () => {
    if (title?.trim() === "") setTitle("")
    const newTitle = title === null || title.trim() === "" ? "" : title
    renameDocument(newTitle)
  }

  /*
    TODO: this solution might be a bit too basic and might need to be replaced with normalization
    It should also take into account the depth of the path and the type of the node (e.g. list items)
  */
  const insertEmptyBlock = () => {
    const newPath = [editor.children.length]
    const lastPath = Path.previous(newPath)
    const [lastNode] = Editor.node(editor, lastPath, { edge: "end" })
    // TODO: this assumes that the node is a leaf (which should always be true because of the way we get it but might cause issues in the future and should probably have some fallbacks)
    if (lastNode.text === "") {
      Transforms.select(editor, lastPath)
    } else {
      Transforms.insertNodes(
        editor,
        cloneDeep({ type: "paragraph", children: [{ text: "" }] }),
        {
          at: newPath,
          select: true,
        }
      )
    }
    ReactEditor.focus(editor)
  }

  return (
    <Container>
      <HoveringToolbar />
      <Toolbar />
      <TitleInput
        ref={titleRef}
        type="text"
        value={title || ""}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        placeholder="Untitled"
      />
      <EditableContainer onBlur={handleContentBlur}>
        <Editable
          plugins={plugins}
          onKeyDown={[handleSaveDocument]}
          spellCheck={false}
        />
        {/* TODO: double-clicking this area moves the selection to the start of the document */}
        <InsertBlockField onClick={() => insertEmptyBlock()} />
      </EditableContainer>
    </Container>
  )
}

export default EditorComponent
