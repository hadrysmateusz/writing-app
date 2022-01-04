import { v4 as uuidv4 } from "uuid"
import { useCallback, useMemo } from "react"
import { Descendant } from "slate"
import { usePlateEditorRef } from "@udecode/plate"

import {
  CreateDocumentFn,
  DEFAULT_EDITOR_VALUE,
  useDocumentsAPI,
} from "../../CloudDocumentsProvider"
import { useTabsDispatch, useTabsState } from "../../TabsProvider"

import { serialize } from "../helpers"
import EditorComponent from "../EditorComponent"
import { GenericDocument_Discriminated } from "../../../types"

export const DummyEditor = () => {
  const editor = usePlateEditorRef()
  const { createDocument } = useDocumentsAPI()
  const {
    tabsState: { currentTab },
  } = useTabsState()
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
    if (!editor) {
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

  // TODO: this is a temp hack, figure out a better solution
  const dummyGenericDocument: GenericDocument_Discriminated = useMemo(
    () => ({
      content: serialize(DEFAULT_EDITOR_VALUE),
      name: "",
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      documentType: "cloud",
      parentIdentifier: null,
      identifier: uuidv4(),
      tags: [],
    }),
    []
  )

  return (
    <EditorComponent
      saveDocument={onSave}
      renameDocument={onRename}
      genericDocument={dummyGenericDocument}
    />
  )
}
