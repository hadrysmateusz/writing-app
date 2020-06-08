import React from "react"
import { VIEWS, ChangeViewFn } from "./types"
import { DocumentDoc } from "../Database"
import SidebarDocumentItem from "./SidebarDocumentItem"
import { RenameDocumentFn, SwitchEditorFn } from "../Main/types"
import { GroupTree } from "../../helpers/createGroupTree"

/**
 * Base presentational component
 *
 * TODO: maybe split the actual list into a separate component
 * for more customisability in advanced views
 */
export const DocumentsList: React.FC<{
  documents: DocumentDoc[]
  groups: GroupTree
  title: string
  onBack: () => void
  renameDocument: RenameDocumentFn
  switchEditor: SwitchEditorFn
}> = ({ documents, title, onBack, switchEditor, renameDocument, groups }) => {
  return (
    <div>
      <div
        style={{
          paddingBottom: "16px",
          borderBottom: "1px solid #363636",
        }}
      >
        <button onClick={onBack}>Back</button>
        <span>{" " + title}</span>
      </div>
      <div>
        {documents.map((document) => (
          <SidebarDocumentItem
            key={document.id}
            document={document}
            groups={groups}
            isCurrent={false}
            isModified={false}
            switchEditor={switchEditor}
            renameDocument={renameDocument}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Container displaying all documents
 */
export const AllDocumentsList: React.FC<{
  changeView: ChangeViewFn
  groups: GroupTree
  documents: DocumentDoc[]
  renameDocument: RenameDocumentFn
  switchEditor: SwitchEditorFn
}> = ({ documents, groups, switchEditor, renameDocument, changeView }) => {
  return (
    <DocumentsList
      documents={documents}
      groups={groups}
      title="All Documents"
      onBack={() => changeView(VIEWS.MAIN)}
      switchEditor={switchEditor}
      renameDocument={renameDocument}
    />
  )
}

// /**
//  * Container displaying documents belonging to a specific group
//  */
// export const DocumentsGroupList: React.FC<{
//   changeView: ChangeViewFn
//   documents: DocumentDoc[]
//   groups: GroupTree
// }> = ({ changeView, documents, groups }) => {
//   //   useEffect(() => {
//   //     // const groupName = groups.find(group=>group.)
//   //   }, [])

//   return (
//     <DocumentsList
//       documents={documents}
//       title="All Documents"
//       onBack={() => changeView(VIEWS.MAIN)}
//     />
//   )
// }
