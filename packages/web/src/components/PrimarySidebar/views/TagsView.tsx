import { useCallback } from "react"

import useRxSubscription from "../../../hooks/useRxSubscription"

import { useDatabase } from "../../Database"
import { MainHeader } from "../../DocumentsList"
import { useTagsAPI } from "../../MainProvider/context"
import { getPromptModalContent, usePromptModal } from "../../PromptModal"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../SidebarCommon"
import { Tag } from "../../Tag"

import { PrimarySidebarBottomButton } from "../PrimarySidebarBottomButton"

const TagAddModalContent = getPromptModalContent("Tag name", "Create")

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
      createTag({ name })
    }
  }, [createTag, toggleableProps])

  return (
    <>
      <PrimarySidebarViewContainer>
        {/* Rework header to support other views than cloud */}
        <MainHeader title="Tags" />
        <InnerContainer groupId={null}>
          {!isLoading && tags
            ? tags.map((tag) => (
                <Tag key={tag.id} id={tag.id} name={tag.name} />
              ))
            : null}
        </InnerContainer>
        <PrimarySidebarBottomButton icon="plus" handleClick={handleNew}>
          New Tag
        </PrimarySidebarBottomButton>
      </PrimarySidebarViewContainer>
      <Modal component={TagAddModalContent} />
    </>
  )
}
