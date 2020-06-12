import React from "react"
import styled from "styled-components/macro"

import SidebarDocumentItem from "./SidebarDocumentItem"
import { useMainState } from "../MainStateProvider"
import { VIEWS, ChangeViewFn } from "./types"

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
      <SectionHeader>
        {/* <button onClick={onBack}>Back</button> */}
        <span>{" " + title}</span>
      </SectionHeader>
      {documents.map((document) => (
        <SidebarDocumentItem key={document.id} document={document} />
      ))}
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
    <DocumentsList title="All Documents" onBack={() => changeView(VIEWS.ALL)} />
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

const SectionHeader = styled.div`
  font-family: Poppins;
  font-weight: bold;
  font-size: 10px;
  user-select: none;

  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 8px 20px;
  border-bottom: 1px solid;
  border-color: #383838;
  color: #a3a3a3;
`
