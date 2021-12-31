import React, { useState, useRef, useEffect } from "react"
import { ReactEditor } from "slate-react"
import { Transforms } from "slate"
import isHotkey from "is-hotkey"
import { usePlateEditorRef, getPlateId } from "@udecode/plate"

import { createEmptyNode } from "../../helpers"

import { StyledTitleNamingInput } from "./TitleInput.styles"

const TitleInput: React.FC<{
  title: string
  onRename: (value: string) => void
}> = ({ title, onRename }) => {
  const editor = usePlateEditorRef(getPlateId("focus"))

  const [value, setValue] = useState<string>(title)
  const titleRef = useRef<HTMLTextAreaElement | null>(null)

  // When the document title changes elsewhere, update the state here
  useEffect(() => {
    setValue(title)
  }, [title])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!editor) {
      console.error("editor is undefined ")
      return false
    }

    // Use the saving keyboard shortcut to apply title change
    if (isHotkey("mod+s", event)) {
      console.log("saving")
      event.preventDefault()
      onRename(value)
    }

    // TODO: allow other ways of navigating between the title and editor content like arrow down and up (there are many multi-line considerations there)
    // TODO: why is the Esc here?
    if (isHotkey(["Enter", "Esc"], event)) {
      // prevent the line break from being inserted into the title (TODO: some version of this behavior might be desirable)
      event.preventDefault()
      // TODO: insert an empty block at the start of the editor
      Transforms.insertNodes(editor, createEmptyNode(), {
        at: [0],
        select: true,
      })
      // move focus to the editor (as if the title was a part of the editable area) - this will automatically trigger a rename
      ReactEditor.focus(editor)
      return false
    }
    return true
  }

  const onChange = (newValue: string) => {
    setValue(newValue)
  }

  const getTitleInputProps = () => ({ onKeyDown, onChange, onRename, value })

  return <StyledTitleNamingInput ref={titleRef} {...getTitleInputProps()} />
}

export default TitleInput
