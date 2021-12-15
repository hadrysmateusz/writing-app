import React from "react"
import styled from "styled-components/macro"

import { CloudDocumentSidebarItem } from "./SidebarDocumentItem"
import { DocumentDoc, LocalSettings } from "../Database"

export const DocumentsList: React.FC<{
  documents: DocumentDoc[]
  listType?: LocalSettings["documentsListDisplayType"]
}> = ({ documents, listType = "tree" }) => {
  // console.log(
  //   "documents:",
  //   documents.map((doc) => doc.toJSON())
  // )
  return documents.length === 0 ? (
    <Empty>Empty</Empty>
  ) : (
    <>
      {documents.map((document) => (
        <CloudDocumentSidebarItem
          key={document.id}
          document={document}
          listType={listType}
        />
      ))}
    </>
  )
}

const Empty = styled.div`
  text-align: center;
  padding: 20px;
  color: var(--light-300);
  user-select: none;
  font-size: 11px;
  font-weight: 500;
`
