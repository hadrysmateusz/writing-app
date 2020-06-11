import React from "react"
import { VIEWS, ChangeViewFn } from "./types"
import SidebarDocumentItem from "./SidebarDocumentItem"
import { useMainState } from "../MainStateProvider"

/**
 * Base presentational component
 *
 * TODO: maybe split the actual list into a separate component
 * for more customisability in advanced views
 */
export const DocumentsList: React.FC<{
  title: string
  onBack: () => void
}> = ({ title, onBack }) => {
  const { documents } = useMainState()

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
          <SidebarDocumentItem key={document.id} document={document} />
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
}> = ({ changeView }) => {
  return (
    <DocumentsList
      title="All Documents"
      onBack={() => changeView(VIEWS.MAIN)}
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
