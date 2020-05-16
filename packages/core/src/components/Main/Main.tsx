import React, { useState, useCallback, useEffect } from "react"
import styled from "styled-components/macro"
import { Node } from "slate"
import { DataStore, Predicates } from "aws-amplify"
import { Slate, ReactEditor } from "slate-react"

import { useCreateEditor } from "@slate-plugin-system/core"

import { Sidebar } from "../Sidebar"
import { EditorComponent } from "../Editor"
import { plugins } from "../../pluginsList"
import { Document } from "../../models"
import { deserialize, serialize } from "../Editor/serialization"
import { useLogEditor, useLogValue } from "../devToolsUtils"
import { listenForIpcEvent } from "../../utils"
import DocumentAdd from "../DocumentAdd"
import DocumentsList from "../DocumentsList"

// TODO: consider creating an ErrorBoundary that will select the start of the document if slate throws an error regarding the selection

declare global {
  interface Window {
    ipcRenderer: any
  }
}

export const defaultState = [{ type: "paragraph", children: [{ text: "" }] }]

const Main = () => {
  return (
    <div>
      <DocumentsList />
      <DocumentAdd />
    </div>
  )
}

// const Main = () => {
//   const [documents, setDocuments] = useState<Document[]>([])
//   // currently selected editor - represented by the document id
//   const [currentEditor, setCurrentEditor] = useState<string | null>(null)
//   // content of the currently selected editor
//   const [content, setContent] = useState<Node[]>(defaultState)
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   // Handle changing all of the state and side-effects of switching editors
//   useEffect(() => {
//     // Reset any properties on the editor objects that shouldn't be shared between documents
//     // TODO; eventually I should save and restore these per documentID
//     const resetEditor = () => {
//       editor.history = { undos: [], redos: [] }
//       editor.selection = {
//         anchor: { path: [0, 0], offset: 0 },
//         focus: { path: [0, 0], offset: 0 },
//       }
//     }

//     const setEditorContent = async () => {
//       if (currentEditor === null) {
//         setContent(defaultState)
//         return
//       }

//       // only get the first document (it should be the only one)
//       DataStore.query(Document, (c) => c.id("eq", currentEditor))
//         .then((documents) => {
//           const document = documents[0]
//           const content = document.content
//             ? deserialize(document.content)
//             : defaultState

//           setContent(content)
//         })
//         .catch((error) => {
//           // TODO: better handle error (show error state)
//           setContent(defaultState)
//           throw error
//         })
//     }

//     ;(async () => {
//       resetEditor()
//       await setEditorContent()
//     })()

//     // eslint-disable-next-line
//   }, [currentEditor])

//   /**
//    * Load documents from db
//    */
//   const loadDocuments = useCallback(async () => {
//     try {
//       // TODO: This could be optimized by manually modifying state based on the subscription message type and content
//       const documents = await DataStore.query(Document, Predicates.ALL)
//       // if there are no current documents deselect current editor
//       if (documents.length === 0) {
//         setCurrentEditor(null)
//       }
//       setDocuments(documents)
//       return documents
//     } catch (error) {
//       setError(error.message)
//       return []
//     }
//   }, [])

//   /**
//    * Initialization effect
//    *
//    * - Fetches all of the user's documents
//    * - Sets up a documents subscription
//    */
//   useEffect(() => {
//     const initialize = async () => {
//       setIsLoading(true)
//       const documents = await loadDocuments()
//       if (!documents[0]) {
//         // TODO: create new document
//         setCurrentEditor(null)
//       } else {
//         setCurrentEditor(documents[0].id)
//       }
//       setIsLoading(false)

//       DataStore.observe(Document).subscribe(loadDocuments)
//     }

//     initialize()
//     // eslint-disable-next-line
//   }, [])

//   /**
//    * Update document
//    */
//   const updateDocument = async (
//     updaterFn: (original: Document) => Promise<Document>
//   ) => {
//     try {
//       if (currentEditor === null) {
//         throw new Error("no editor is currently selected")
//       }

//       const original = documents.find((doc) => doc.id === currentEditor)

//       if (original === undefined) {
//         throw new Error("no document found matching current editor id")
//       }

//       const updatedDocument = await updaterFn(original)

//       return updatedDocument
//     } catch (error) {
//       const msgBase = "Can't update the current document"
//       console.error(`${msgBase}: ${error.message}`)
//       setError(msgBase)
//       return null
//     }
//   }

//   /**
//    * Save document
//    */
//   const saveDocument = () => {
//     return updateDocument((original) => {
//       const serializedContent = serialize(content)

//       return DataStore.save(
//         Document.copyOf(original, (updated) => {
//           updated.content = serializedContent
//         })
//       )
//     })
//   }

//   /**
//    * Rename document
//    */
//   const renameDocument = async (title: string) => {
//     return updateDocument((original) =>
//       DataStore.save(
//         Document.copyOf(original, (updated) => {
//           updated.title = title
//         })
//       )
//     )
//   }

//   /**
//    * onChange event handler for the Slate component
//    */
//   const onChange = useCallback((value: Node[]) => {
//     setContent(value)
//   }, [])

//   // Create the editor object
//   const editor = useCreateEditor(plugins) as ReactEditor

//   /**
//    * Handles creating a new document by asking for a name, creating a document
//    * in DataStore and switching the editor to the new document
//    */
//   const newDocument = useCallback(async (shouldSwitch: boolean = true) => {
//     const content = JSON.stringify(defaultState)

//     const newDocument = await DataStore.save(
//       new Document({
//         title: "",
//         content,
//       })
//     )

//     if (shouldSwitch) {
//       setCurrentEditor(newDocument.id)
//     }

//     return newDocument
//   }, [])

//   // DevTools utils
//   useLogEditor(editor)
//   useLogValue(content)

//   // Handle "new-document" messages from the main process
//   useEffect(
//     () =>
//       listenForIpcEvent("new-document", () => {
//         // Remove domSelection to prevent errors
//         window.getSelection()?.removeAllRanges()
//         // Create the new document
//         newDocument()
//       }),
//     [newDocument]
//   )

//   const currentDocument =
//     documents.find((doc) => doc.id === currentEditor) || null

//   return (
//     <Slate editor={editor} value={content} onChange={onChange}>
//       <InnerContainer>
//         {isLoading
//           ? "Loading..."
//           : error ?? (
//               <>
//                 <Sidebar
//                   switchEditor={setCurrentEditor}
//                   documents={documents}
//                   newDocument={newDocument}
//                 />
//                 {currentDocument && (
//                   <EditorComponent
//                     key={currentDocument.id} // Necessary to reload the component on id change
//                     currentDocument={currentDocument}
//                     saveDocument={saveDocument}
//                     renameDocument={renameDocument}
//                   />
//                 )}
//               </>
//             )}
//       </InnerContainer>
//     </Slate>
//   )
// }

// const InnerContainer = styled.div`
//   display: grid;
//   grid-template-columns: 250px 1fr;
//   width: 100vw;
//   height: 100vh; /* TODO: this needs to be improved */
//   background-color: #24292e;
//   color: white;
//   font-family: "Segoe UI", "Open sans", "sans-serif";
// `

export default Main
