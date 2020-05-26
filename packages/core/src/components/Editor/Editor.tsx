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

/**
 * Helper for creating a basic empty node
 *
 * The deep cloning prevents issues with react keys
 */
const createEmptyNode = () => {
  return cloneDeep({
    type: "paragraph",
    children: [{ text: "" }],
  })
}

const EditorComponent: React.FC<{
  saveDocument: () => Promise<Document | null>
  renameDocument: (
    documentId: string,
    title: string
  ) => Promise<Document | null>
  currentDocument: Document
}> = ({ saveDocument, renameDocument, currentDocument }) => {
  const [title, setTitle] = useState<string>(currentDocument.title)
  const titleRef = useRef<HTMLTextAreaElement | null>(null)
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

  // TODO: try using this event in the entire editor area as it would be more intuitive I think
  // TODO: also apply renaming (if focus is in the title input)
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
    renameDocument(currentDocument.id, title)
  }

  /*
    TODO: this solution might be a bit too basic and might need to be replaced with normalization
    It should also take into account the depth of the path and the type of the node (e.g. list items)
    TODO: this should probably be merged with a solution for selecting the correct block by clicking 
    next to it - my best guess is, it would be an event listener on the entire editor area that would 
    get the position of the click and compare it to the bounding boxes of blocks until it finds the 
    correct one (this would be a good place to use a more efficient search algorithm as it's not 
    insignificantly expensive to compare the positions of many nodes)
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

  const handleTitleKeydown = (event: React.KeyboardEvent) => {
    if (isHotkey(["Enter", "Esc"], event)) {
      // move focus to the editor (as if the title was a part of the editable area) - this will automatically trigger a rename
      ReactEditor.focus(editor)
    }
  }

  return (
    <Container>
      <HoveringToolbar />
      <Toolbar />
      <TitleInput
        ref={titleRef}
        value={title || ""}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        onKeyDown={handleTitleKeydown}
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
