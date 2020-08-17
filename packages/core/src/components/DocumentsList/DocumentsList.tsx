import React from "react"
import styled from "styled-components/macro"

import SidebarDocumentItem from "./SidebarDocumentItem"
import { DocumentDoc } from "../Database"
import { SectionHeader } from "./SectionHeader"

/**
 * Base presentational component
 */
export const DocumentsList: React.FC<{
  title: string
  documents: DocumentDoc[]
  groupId?: string
}> = ({ title, documents, groupId }) => {
  return (
    <>
      <SectionHeader groupId={groupId}>{title}</SectionHeader>
      <DocumentsListWithoutHeader groupId={groupId} documents={documents} />
    </>
  )
}

export const DocumentsListWithoutHeader: React.FC<{
  groupId?: string
  documents: DocumentDoc[]
}> = ({ groupId, documents }) => {
  return documents.length === 0 ? (
    <Empty>Empty</Empty>
  ) : (
    <>
      {documents.map((document) => (
        <SidebarDocumentItem
          key={document.id}
          document={document}
          groupId={groupId}
        />
      ))}
    </>
  )
}

const Empty = styled.div`
  text-align: center;
  padding: 20px;
  color: #aaa;
  user-select: none;
  font-size: 11px;
  font-weight: 500;
  :not(:last-child) {
    border-bottom: 1px solid;
    border-color: #383838;
  }
`