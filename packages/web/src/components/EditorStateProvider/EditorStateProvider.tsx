import React, { useCallback, useState, useMemo } from "react"
import { isEqual } from "lodash"
import { Descendant, BaseEditor } from "slate"
import { ReactEditor } from "slate-react"
import {
  useEventEditorId,
  useStoreEditorState,
  useStoreEditorValue,
} from "@udecode/plate-core"

import { SaveDocumentFn, useMainState } from "../MainProvider"
import { /* deserialize, */ serialize } from "../Editor"

// import { DEFAULT_EDITOR_VALUE, EditorState } from "../Main"

// import { useDevUtils } from "../../dev-tools"
// import { withDelayRender } from "../../withDelayRender"
import { createContext } from "../../utils"

type ImageElement = {
  type: "image"
  url: string
  children: (CustomText | CustomElement)[]
}
type GenericElement = { type: string; children: (CustomText | CustomElement)[] }
type CustomElement = GenericElement | ImageElement
type CustomText = { text: string }
type CustomEditor = BaseEditor & ReactEditor & { type: string | undefined }

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}

const NoEditorState = withDelayRender(1000)(() => <div>No editor object</div>)

export const [EditorStateContext, useEditorState] = createContext<any>() // TODO: fix the typings when I stabilize the api

/**
 * State provider for editor and secondary sidebar
 */
export const EditorStateProvider: React.FC = ({ children }) => {
  const { currentDocument } = useMainState()
  const editor = useStoreEditorState(useEventEditorId("focus"))
  const editorValue = useStoreEditorValue(useEventEditorId("focus"))

  // const [editorValue, setEditorValue] = useState<Descendant[]>(
  //   DEFAULT_EDITOR_VALUE
  // )
  const [isModified, setIsModified] = useState(false)

  // useEffect(() => {
  //   // TODO: replace defaultEditorValue with null
  //   const content = currentDocument?.content
  //     ? deserialize(currentDocument.content)
  //     : DEFAULT_EDITOR_VALUE

  //   setEditorValue(content)
  // }, [currentDocument])

  // If the editor needs to be accessed above in the react tree, try using some kind of pub/sub / event system. Don't lift this because it will have a huge performance impact
  // const [editor, setEditor] = useState<CustomEditor | null>(null)

  // const createEditorObject = useCallback(() => {
  //   // let editor = applyPlugins(createEditor(), plugins) as ReactEditor
  //   let editor = withReact(createEditor())
  //   setEditor(editor)
  // }, [])

  // /**
  //  * Creates the editor object
  //  */
  // useEffect(() => {
  //   createEditorObject()
  // }, [createEditorObject])

  /**
   * onChange event handler for the Slate component
   */
  const onChange = useCallback(
    (value: Descendant[]) => {
      // // TODO: I could debounced-save in here
      // setEditorValue(value)

      // if the content has changed, set the modified flag (skip the expensive check if it's already true)
      if (!isModified) {
        const hasChanged = !isEqual(editorValue, value)
        if (hasChanged) {
          setIsModified(true)
        }
      }
    },
    [editorValue, isModified]
  )

  /**
   * Save document
   *
   * Works on the current document
   */
  const saveDocument: SaveDocumentFn = useCallback(async () => {
    if (editor === undefined) {
      console.error("Can't save, the editor is undefined")
      return null
    }

    const nodes = editor.children as Descendant[]

    if (isModified) {
      const updatedDocument =
        (await currentDocument?.atomicUpdate((doc) => {
          doc.content = serialize(nodes)
          return doc
        })) || null

      setIsModified(false)
      return updatedDocument
    }
    return null
  }, [currentDocument, editor, isModified])

  // useDevUtils({ value: editorValue, editor })

  const editorState = useMemo(
    () => ({
      isModified,
      editorValue,
      resetEditor: /* createEditorObject */ () => null,
      saveDocument,
      setIsModified,
      setEditorValue: () => null,
      onChange,
    }),
    [editorValue, isModified, onChange, saveDocument]
  )

  // return editor ? (
  //   <>
  //     {/* <Slate editor={editor} value={editorValue} onChange={onChange}> */}
  //     <EditorStateContext.Provider value={editorState}>
  //       {/* <ImageModalProvider>
  //         <LinkModalProvider>{children}</LinkModalProvider>
  //       </ImageModalProvider> */}
  //       <LinkModalProvider>{children}</LinkModalProvider>
  //     </EditorStateContext.Provider>
  //     {/* </Slate> */}
  //   </>
  // ) : (
  //   <NoEditorState />
  // )

  return (
    <EditorStateContext.Provider value={editorState}>
      {children}
    </EditorStateContext.Provider>
  )
}
