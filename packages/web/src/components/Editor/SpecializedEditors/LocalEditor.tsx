import React, { useCallback, useEffect, useState } from "react"
import { Descendant } from "slate"
import { usePlateEditorRef, usePlateEventId } from "@udecode/plate"

import {
  myDeserializeMd,
  mySerializeMd,
} from "../../../slate-helpers/deserialize"

import { DEFAULT_EDITOR_VALUE } from "../../DocumentsAPIProvider"

import { DocumentEmptyState, DocumentLoadingState } from "../HelperStates"
import EditorComponent from "../EditorComponent"

type DocumentState = {
  isLoading: boolean
  isMissing: boolean
  document:
    | {
        title: string
        content: Descendant[]
      }
    | undefined
}

const INITIAL_DOCUMENT_STATE: DocumentState = {
  isLoading: true,
  isMissing: false,
  document: undefined,
}

export const LocalEditor: React.FC<{ currentDocumentPath: string }> = ({
  currentDocumentPath,
}) => {
  const [documentState, setDocumentState] = useState<DocumentState>(
    INITIAL_DOCUMENT_STATE
  )

  const editor = usePlateEditorRef(usePlateEventId("focus"))

  useEffect(() => {
    ;(async () => {
      console.log("LOCAL EDITOR USEEFFECT")
      setDocumentState({
        isLoading: true,
        isMissing: false,
        document: undefined,
      })

      const ipcResponse = await window.electron.invoke("OPEN_FILE", {
        filePath: currentDocumentPath,
      })

      console.log(ipcResponse)

      if (ipcResponse.status === "success") {
        // TODO: handle possible data-shape errors

        // TODO: support other deserializers (maybe, or probably just for importing to cloud documents)
        let deserialized = myDeserializeMd(ipcResponse.data.file.content)
        if (deserialized.length === 0) {
          deserialized = DEFAULT_EDITOR_VALUE
        }

        console.log("deserialized:", deserialized)
        setDocumentState({
          document: {
            title: ipcResponse.data.file.name,
            content: deserialized,
          },
          isLoading: false,
          isMissing: false,
        })
      } else {
        console.warn("something went wrong")
        setDocumentState({
          document: undefined,
          isLoading: false,
          isMissing: true,
        })
      }
    })()
  }, [currentDocumentPath])

  const saveDocument = useCallback(async () => {
    if (!editor) {
      console.warn("no editor")
      return
    }

    console.log(editor.children)

    const serializedContent = mySerializeMd(editor.children)

    console.log("serialized:", serializedContent)

    const ipcResponse = await window.electron.invoke("SAVE_FILE", {
      filePath: currentDocumentPath,
      content: serializedContent,
    })
    console.log(ipcResponse)
  }, [currentDocumentPath, editor])

  const renameDocument = useCallback(() => {
    console.log("TODO: implement")
  }, [])

  return documentState.document ? (
    <EditorComponent
      key={currentDocumentPath}
      saveDocument={saveDocument}
      renameDocument={renameDocument}
      title={documentState.document.title}
      content={documentState.document.content}
    />
  ) : documentState.isLoading ? (
    <DocumentLoadingState />
  ) : documentState.isMissing ? (
    <div>Document was deleted</div>
  ) : (
    <DocumentEmptyState />
  )
}

export default LocalEditor
