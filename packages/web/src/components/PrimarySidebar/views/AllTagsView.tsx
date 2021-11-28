import React, { FC, useMemo } from "react"
import { useToggleable } from "../../../hooks"

import useRxSubscription from "../../../hooks/useRxSubscription"

import { DocumentDoc, TagDoc, useDatabase } from "../../Database"
import { DocumentsList, MainHeader, SectionHeader } from "../../DocumentsList"
import { useDocumentsAPI } from "../../MainProvider"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../SidebarCommon"
import { SIDEBAR_VAR } from "../../ViewState"

import { PrimarySidebarBottomButton } from "../PrimarySidebarBottomButton"

function assignDocsToTags(tags: TagDoc[], documents: DocumentDoc[]) {
  // simplify tag docs to only the necessary data and add a docCount field for later
  const newTags = tags.map((tag) => ({ ...tag.toJSON(), docs: [] }))
  // iterate over all docs and count the number of occurences of each tag
  const tagsCounter = {}
  documents.forEach((doc) => {
    doc.tags.forEach((tagOnDoc) => {
      // if tagId is already present on object increment its count, otherwise initialize it to 0
      if (tagsCounter[tagOnDoc] === undefined) {
        tagsCounter[tagOnDoc] = []
      } else {
        tagsCounter[tagOnDoc].push(doc)
      }
    })
  })
  // assign docCount to each tag in array
  newTags.forEach((tag) => {
    tag.docs = tagsCounter[tag.id]
  })
  // sort tags array by docCount ASC
  newTags.sort((a, b) => b.docs.length - a.docs.length)
  return newTags
}

export const AllTagsView: React.FC = () => {
  const db = useDatabase()
  const { createDocument } = useDocumentsAPI()

  const { data: tags } = useRxSubscription(db.tags.find())
  const { data: documents } = useRxSubscription(db.documents.findNotRemoved())

  const sortedTags = useMemo(() => {
    if (!tags || !documents) return null
    return assignDocsToTags(tags, documents)
  }, [documents, tags])

  return (
    <>
      <PrimarySidebarViewContainer>
        <MainHeader title="All Tags" goUpPath={SIDEBAR_VAR.primary.cloud.all} />
        <InnerContainer>
          {sortedTags?.map((tag) => (
            <TagDocumentsList tagName={tag.name} documents={tag.docs} />
          )) ?? null}
        </InnerContainer>
        <PrimarySidebarBottomButton
          icon="plus"
          handleClick={() => {
            createDocument(
              { parentGroup: null },
              {
                switchToDocument: true,
                switchToGroup: false,
              }
            )
          }}
        >
          New Document
        </PrimarySidebarBottomButton>
      </PrimarySidebarViewContainer>
      {/* <Modal component={TagAddModalContent} /> */}
    </>
  )
}

const TagDocumentsList: FC<{
  tagName: string
  documents: DocumentDoc[]
}> = ({ tagName, documents }) => {
  const { toggle, isOpen } = useToggleable(true)

  return documents.length > 0 ? (
    <>
      <SectionHeader groupId={undefined} onToggle={toggle} isOpen={isOpen}>
        {tagName}
      </SectionHeader>
      {isOpen ? <DocumentsList documents={documents} /> : null}
    </>
  ) : null
}