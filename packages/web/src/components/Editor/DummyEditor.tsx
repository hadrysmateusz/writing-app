import React, { useRef, useState } from "react"
import isHotkey from "is-hotkey"
import { Plate, usePlateEditorRef, usePlateEventId } from "@udecode/plate"
import { Descendant } from "slate"

import {
  CreateDocumentFn,
  useDocumentsAPI,
  useMainState,
  useTabsState,
} from "../MainProvider"
import { Toolbar } from "../Toolbar"
import { serialize } from "../Editor/serialization"
import { useTabsDispatch } from "../MainProvider"

import { StyledTitleNamingInput } from "./TitleInput"
import pluginsList from "./pluginsList"
import {
  EditableContainer,
  OuterContainer,
  InnerContainer,
} from "./styledComponents"

// TODO: remove remaining duplication with Editor

const DummyTitleInput: React.FC<{
  createDocumentAndReplaceTab: (
    values: Parameters<CreateDocumentFn>[1]
  ) => Promise<void>
}> = ({ createDocumentAndReplaceTab }) => {
  const [value, setValue] = useState<string>("")
  const titleRef = useRef<HTMLTextAreaElement | null>(null)

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
    if (newValue.trim() !== "") {
      createDocumentAndReplaceTab({ title: newValue })
    }
  }

  const getTitleInputProps = () => ({ onKeyDown, onChange, onRename, value })

  return <StyledTitleNamingInput ref={titleRef} {...getTitleInputProps()} />
}

export const DummyEditor = () => {
  const editor = usePlateEditorRef(usePlateEventId("focus"))

  const { createDocument } = useDocumentsAPI()
  const { currentTab } = useTabsState()
  const tabsDispatch = useTabsDispatch()

  const createDocumentAndReplaceTab = async (
    values: Parameters<CreateDocumentFn>[1]
  ) => {
    // create document and use current content (switch to it in a new tab as well)
    const newDocument = await createDocument(
      null /* TODO: infer group */,
      values,
      {
        switchToDocument: false,
        switchToGroup: true,
      }
    )
    // replace old placeholder tab
    tabsDispatch({
      type: "replace-tab",
      tab: {
        tabId: currentTab,
        tabType: "cloudDocument",
        documentId: newDocument.id,
        keep: true,
      },
    })
  }

  // TODO: remove duplication with onRename in DummyTitleInput
  const onSave = async () => {
    // TODO: remove duplication with saveDocument function logic
    if (editor === undefined) {
      console.error("Can't save, the editor is undefined")
      return
    }

    const nodes = editor.children as Descendant[]
    const serializedContent = serialize(nodes)

    if (nodes.length > 0) {
      createDocumentAndReplaceTab({ content: serializedContent })
    }
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
            editableProps={editableProps}
            // onChange={onChange} TODO: maybe use this to trigger document creation (or any click inside the editor)
          >
            <DummyTitleInput
              createDocumentAndReplaceTab={createDocumentAndReplaceTab}
            />
            <Toolbar />
          </Plate>
        </EditableContainer>
      </InnerContainer>
    </OuterContainer>
  )
}
