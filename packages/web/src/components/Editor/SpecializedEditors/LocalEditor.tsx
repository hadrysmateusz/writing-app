import React, { useCallback, useEffect, useState } from "react"
import { Descendant } from "slate"
import { usePlateEditorRef, usePlateEventId } from "@udecode/plate"

import {
  myDeserializeMd,
  mySerializeMd,
} from "../../../slate-helpers/deserialize"

import { DEFAULT_EDITOR_VALUE } from "../../MainProvider"

import { DocumentEmptyState, DocumentLoadingState } from "../HelperStates"
import EditorComponent from "../EditorComponent"

export const LocalEditor: React.FC<{ currentDocumentPath: string }> = ({
  currentDocumentPath,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState<string>()
  const [content, setContent] = useState<Descendant[]>()
  const editor = usePlateEditorRef(usePlateEventId("focus"))

  useEffect(() => {
    ;(async () => {
      console.log("LOCAL EDITOR USEEFFECT")
      setIsLoading(true)

      const ipcResponse = await window.electron.invoke("OPEN_FILE", {
        filePath: currentDocumentPath,
      })

      console.log(ipcResponse)

      if (ipcResponse.status === "success") {
        // TODO: handle possible data-shape errors
        setTitle(ipcResponse.data.file.fileName)
        // TODO: support other deserializers (maybe, or probably just for importing to cloud documents)

        let deserialized = myDeserializeMd(ipcResponse.data.file.content)
        if (deserialized.length === 0) {
          deserialized = DEFAULT_EDITOR_VALUE
        }

        console.log("deserialized:", deserialized)
        setContent(deserialized)
      } else {
        // TODO: handle this
        console.warn("something went wrong")
      }

      setIsLoading(false)
    })()
  }, [currentDocumentPath])

  console.log(title, content)

  const saveDocument = useCallback(async () => {
    if (!editor) {
      console.warn("no editor")
      return
    }

    console.log(editor.children)

    const serializedContent = mySerializeMd(editor.children)

    console.log("serialized:", serializedContent)

    const ipcResponse = await window.electron.invoke("WRITE_FILE", {
      filePath: currentDocumentPath,
      content: serializedContent,
    })
    console.log(ipcResponse)
  }, [currentDocumentPath, editor])

  const renameDocument = useCallback(() => {
    console.log("TODO: implement")
  }, [])

  return !isLoading && content && title ? (
    <EditorComponent
      key={currentDocumentPath}
      saveDocument={saveDocument}
      renameDocument={renameDocument}
      title={title}
      content={content}
    />
  ) : isLoading ? (
    <DocumentLoadingState />
  ) : (
    <DocumentEmptyState />
  )
}

export default LocalEditor
