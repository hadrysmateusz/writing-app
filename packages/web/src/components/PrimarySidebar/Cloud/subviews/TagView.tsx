import { useMemo } from "react"

import useRxSubscription from "../../../../hooks/useRxSubscription"

import {
  CloudDocumentSortingSubmenu,
  GoUpMainHeaderButton,
  MainHeader,
  MoreMainHeaderButton,
} from "../../../DocumentsList"
import { useDatabase } from "../../../Database"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import {
  parseSidebarPath,
  SIDEBAR_VAR,
  usePrimarySidebar,
} from "../../../ViewState"
import { useSorting } from "../../../SortingProvider"

import { NewButton } from "../../NewButton"
import { CloudDocumentsList } from "../SubGroups"

export const TagView: React.FC = () => {
  const { currentSubviews } = usePrimarySidebar()

  const tagId = useMemo(
    () => parseSidebarPath(currentSubviews.cloud)?.id,
    [currentSubviews.cloud]
  )

  return tagId ? <TagViewWithFoundTagId tagId={tagId} /> : null
}

const TagViewWithFoundTagId: React.FC<{ tagId: string }> = ({ tagId }) => {
  const db = useDatabase()
  // const { primarySidebar } = useViewState()
  const { sorting } = useSorting()

  const { data: tag, isLoading: isTagLoading } = useRxSubscription(
    db.tags.findOne().where("id").eq(tagId)
  )

  const { data: documents, isLoading: isDocumentsLoading } = useRxSubscription(
    db.documents
      .find()
      .where("isDeleted")
      .eq(false)
      .where("tags")
      .elemMatch({ $eq: tagId })
      .sort({ [sorting.index]: sorting.direction })
  )

  const ok = !!documents && !!tag

  // // If the tag wasn't found, switch to more general sidebar view
  // useEffect(() => {
  //   if (!ok) {
  //     primarySidebar.switchSubview("cloud", "all")
  //     // TODO: the auto-switching might be confusing and lead to issue, I could simply replace it with an error state, prompting the user to switch the view themselves, it should be very rare anyway
  //   }
  // }, [ok, primarySidebar])

  return ok ? (
    <PrimarySidebarViewContainer>
      <MainHeader
        title={tag.name}
        buttons={[
          <GoUpMainHeaderButton
            goUpPath={SIDEBAR_VAR.primary.tags.all}
            key={SIDEBAR_VAR.primary.tags.all}
          />,
          <MoreMainHeaderButton
            key="sorting"
            contextMenuContent={
              <>
                <CloudDocumentSortingSubmenu />
              </>
            }
          />,
        ]}
      />
      <InnerContainer>
        {!isTagLoading && !isDocumentsLoading ? (
          <CloudDocumentsList documents={documents || []} listType="flat" />
        ) : null}
      </InnerContainer>
      {/* TODO:  Rework NewButton to work with tags as well as groups */}
      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  ) : null
}
