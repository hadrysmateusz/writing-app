import { useCallback } from "react"
import { usePlateEditorRef, usePlateEventId } from "@udecode/plate"
import { Descendant } from "slate"

import {
  CreateDocumentFn,
  DEFAULT_EDITOR_VALUE,
  useDocumentsAPI,
  useTabsState,
} from "../../MainProvider"
import { useTabsDispatch } from "../../MainProvider"

import { serialize } from "../helpers"
import EditorComponent from "../EditorComponent"

export const DummyEditor = () => {
  const editor = usePlateEditorRef(usePlateEventId("focus"))
  const { createDocument } = useDocumentsAPI()
  const { currentTab } = useTabsState()
  const tabsDispatch = useTabsDispatch()

  const createDocumentAndReplaceTab = useCallback(
    async (values: Parameters<CreateDocumentFn>[0]) => {
      // create document and use current content (switch to it in a new tab as well)
      const newDocument = await createDocument(values, {
        switchToDocument: false,
        switchToGroup: true,
      })
      // replace old placeholder tab
      tabsDispatch({
        type: "replace-tab",
        tab: {
          tabId: currentTab,
          tabType: "cloudDocument",
          documentId: newDocument.id,
          keep: true,
        },
        switch: true,
      })
    },
    [createDocument, currentTab, tabsDispatch]
  )

  const onRename = useCallback(
    (value: string) => {
      createDocumentAndReplaceTab({ parentGroup: null, title: value })
    },
    [createDocumentAndReplaceTab]
  )

  // TODO: remove duplication with onRename in DummyTitleInput
  const onSave = useCallback(async () => {
    // TODO: remove duplication with saveDocument function logic
    if (editor === undefined) {
      console.error("Can't save, the editor is undefined")
      return
    }

    const nodes = editor.children as Descendant[]
    const serializedContent = serialize(nodes)

    if (nodes.length > 0) {
      createDocumentAndReplaceTab({
        parentGroup: null /* TODO: infer group */,
        content: serializedContent,
      })
    }
  }, [createDocumentAndReplaceTab, editor])

  return (
    <EditorComponent
      key={currentTab} // Necessary to reload the component on id change
      saveDocument={onSave}
      renameDocument={onRename}
      title={""}
      content={DEFAULT_EDITOR_VALUE}
    />
  )
}
