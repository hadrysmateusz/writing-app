import { useCallback, useMemo } from "react"

import useRxSubscription from "../../../../hooks/useRxSubscription"

import { TagDoc, useDatabase } from "../../../Database"
import { getPromptModalContent, usePromptModal } from "../../../PromptModal"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import { TagListItem } from "../../../TagListItem"
import { useTagsAPI } from "../../../TagsProvider"
import { MainHeader } from "../../MainHeader"

import { PrimarySidebarBottomButton } from "../../PrimarySidebarBottomButton"

const TagAddModalContent = getPromptModalContent({
  promptMessage: "Tag name",
  submitMessage: "Create",
  inputPlaceholder: "Tag name",
})

export const TagsView: React.FC = () => {
  const db = useDatabase()
  const { createTag } = useTagsAPI()

  const { data: tags, isLoading } = useRxSubscription(
    db.tags.find().sort({ nameSlug: "desc" })
  )

  const { Modal, ...toggleableProps } = usePromptModal("")

  const handleNew = useCallback(async () => {
    const name = await toggleableProps.open({ initialValue: "" })

    if (name?.trim()) {
      await createTag({ name })
    }
  }, [createTag, toggleableProps])

  return (
    <>
      <PrimarySidebarViewContainer>
        <MainHeader
          title="Tags"
          buttons={
            [
              // <GoUpMainHeaderButton
              //   goUpPath={SIDEBAR_VAR.primary.cloud.all}
              //   key={SIDEBAR_VAR.primary.cloud.all}
              // />,
              // TODO: support sorting for tags
              // <SortingMainHeaderButton key="sorting" />,
            ]
          }
        />
        {/* TODO: Rework inner container to support tags */}
        <InnerContainer>
          {!isLoading && tags ? <TagsList tags={tags || []} /> : null}
        </InnerContainer>
        <PrimarySidebarBottomButton icon="plus" handleClick={handleNew}>
          New Tag
        </PrimarySidebarBottomButton>
      </PrimarySidebarViewContainer>
      <Modal component={TagAddModalContent} />
    </>
  )
}

const TagsList: React.FC<{ tags: TagDoc[] }> = ({ tags }) => {
  const db = useDatabase()

  const { data: documents } = useRxSubscription(db.documents.findNotRemoved())

  const numDocsInTags = useMemo(() => {
    const _numDocsInTags = {}

    if (!documents) {
      return {}
    }

    for (let doc of documents) {
      for (let tag of doc.tags) {
        if (!_numDocsInTags[tag]) {
          _numDocsInTags[tag] = 0
        }
        _numDocsInTags[tag] += 1
      }
    }
    return _numDocsInTags
  }, [documents])

  return (
    <>
      {tags.map((tag) => (
        <TagListItem
          key={tag.id}
          id={tag.id}
          name={tag.name}
          numDocs={numDocsInTags[tag.id]}
        />
      ))}
    </>
  )
}
