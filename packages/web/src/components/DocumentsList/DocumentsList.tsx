import React from "react"
import styled from "styled-components/macro"

import SidebarDocumentItem from "./SidebarDocumentItem"
import { DocumentDoc } from "../Database"
import { SectionHeader } from "./SectionHeader"
import MainHeader from "./MainHeader"

export const DocumentsList: React.FC<{
  title: string
  documents: DocumentDoc[]
  groupId?: string | null
  parentGroupId?: string | null
  main?: boolean
}> = ({ title, documents, groupId, parentGroupId, main = false }) => {
  return (
    <>
      {main ? (
        <MainHeader title={title} parentGroupId={parentGroupId} />
      ) : (
        <SectionHeader groupId={groupId}>{title}</SectionHeader>
      )}
      <DocumentsListWithoutHeader groupId={groupId} documents={documents} />
    </>
  )
}

export const DocumentsListWithoutHeader: React.FC<{
  groupId?: string | null
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
`
