import React, { useRef, useState } from "react"
import isHotkey from "is-hotkey"
import {
  Plate,
  createPlateComponents,
  createPlateOptions,
  useStoreEditorRef,
  useEventEditorId,
} from "@udecode/plate"
import { Descendant } from "slate"

import { useDocumentsAPI, useMainState, useTabsState } from "../MainProvider"
import { Toolbar } from "../Toolbar"

import { StyledTitleNamingInput } from "./TitleInput"
import pluginsList from "./pluginsList"
import {
  EditableContainer,
  OuterContainer,
  InnerContainer,
} from "./styledComponents"

// TODO: remove remaining duplication with Editor

const components = createPlateComponents()
const options = createPlateOptions()

const DummyTitleInput = () => {
  const [value, setValue] = useState<string>("")
  const titleRef = useRef<HTMLTextAreaElement | null>(null)

  const { createDocument } = useDocumentsAPI()
  const { tabsDispatch } = useMainState()
  const { currentTab } = useTabsState()

  const onKeyDown = (event: React.KeyboardEvent) => {
    // Use the saving keyboard shortcut to apply title change
    if (isHotkey("mod+s", event)) {
      console.log("saving")
      event.preventDefault()
      onRename(value)
    }

    // if (isHotkey(["Enter", "Esc"], event)) {
    //   // prevent the line break from being inserted into the title (TODO: some version of this behavior might be desirable)
    //   event.preventDefault()
    //   // TODO: insert an empty block at the start of the editor
    //   Transforms.insertNodes(editor, createEmptyNode(), {
    //     at: [0],
    //     select: true,
    //   })
    //   // move focus to the editor (as if the title was a part of the editable area) - this will automatically trigger a rename
    //   ReactEditor.focus(editor)
    //   return false
    // }
    return true
  }

  const onChange = (newValue: string) => {
    setValue(newValue)
  }

  const onRename = async (newValue: string) => {
    // create document and use current title
    await createDocument(
      null /* TODO: infer group */,
      {
        title: newValue,
      },
      {
        switchToDocument: true,
        switchToGroup: false,
      }
    )
    // close old placeholder tab
    tabsDispatch({ type: "close-tab", tabId: currentTab })
  }

  const getTitleInputProps = () => ({ onKeyDown, onChange, onRename, value })

  return <StyledTitleNamingInput ref={titleRef} {...getTitleInputProps()} />
}

export const DummyEditor = () => {
  const editor = useStoreEditorRef(useEventEditorId("focus"))

  const { createDocument } = useDocumentsAPI()
  const { tabsDispatch } = useMainState()
  const { currentTab } = useTabsState()

  // TODO: remove duplication with onRename in DummyTitleInput
  const onSave = async () => {
    // TODO: remove duplication with saveDocument function logic
    if (editor === undefined) {
      console.error("Can't save, the editor is undefined")
      return
    }

    const nodes = editor.children as Descendant[]

    // create document and use current content (switch to it in a new tab as well)
    await createDocument(
      null /* TODO: infer group */,
      {
        content: nodes,
      },
      {
        switchToDocument: true,
        switchToGroup: false,
      }
    )
    // close old placeholder tab
    tabsDispatch({ type: "close-tab", tabId: currentTab })
  }

  const editableProps = {
    placeholder: "Start writing…",
    spellCheck: /* isSpellCheckEnabled */ false, // TODO: change this back when I restore userdata
    onBlur: (e) => {
      // TODO: if you close the window or reload without clicking on something else the blur doesn't trigger and the content doesn't get saved
      onSave()
    },
  }

  return (
    <OuterContainer
      onKeyDown={(e) => {
        if (isHotkey("mod+s", e)) {
          e.preventDefault()
          onSave()
        }
      }}
    >
      <InnerContainer>
        <EditableContainer>
          <Plate
            id="main"
            plugins={pluginsList}
            components={components}
            options={options}
            editableProps={editableProps}
            // onChange={onChange} TODO: maybe use this to trigger document creation (or any click inside the editor)
          >
            <DummyTitleInput />
            <Toolbar />
          </Plate>
        </EditableContainer>
      </InnerContainer>
    </OuterContainer>
  )
}
