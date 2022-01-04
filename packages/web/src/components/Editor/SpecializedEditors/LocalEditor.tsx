import React, { useCallback, useEffect, useState } from "react"
import { usePlateEditorRef } from "@udecode/plate"

import { mySerializeMd } from "../../../slate-helpers"
import { createGenericDocumentFromLocalFile } from "../../../helpers"
import { GenericDocument_LocalVariant } from "../../../types"

import { DocumentEmptyState, DocumentLoadingState } from "../HelperStates"
import EditorComponent from "../EditorComponent"

type DocumentState = {
  isLoading: boolean
  isMissing: boolean
  document: GenericDocument_LocalVariant | undefined
}

const INITIAL_DOCUMENT_STATE: DocumentState = {
  isLoading: true,
  isMissing: false,
  document: undefined,
}

// TODO: support missing documents like VSCode does, by showing special styling on tab but keeping content cached in memory/state allowing the user to re-save the document with changes even if it was deleted in FS
export const LocalEditor: React.FC<{ currentDocumentPath: string }> = ({
  currentDocumentPath,
}) => {
  const [documentState, setDocumentState] = useState<DocumentState>(
    INITIAL_DOCUMENT_STATE
  )

  const editor = usePlateEditorRef()

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

        const genericDocument = createGenericDocumentFromLocalFile(
          ipcResponse.data.file
        )
        setDocumentState({
          document: genericDocument,
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
      saveDocument={saveDocument}
      renameDocument={renameDocument}
      genericDocument={documentState.document}
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
