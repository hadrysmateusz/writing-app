import { useMemo } from "react"

import { useQueryWithSorting, useRxSubscription } from "../../../../hooks"

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

import { FlatDocumentsList } from "../../DocumentsList"
import {
  CloudDocumentSortingSubmenu,
  GoUpMainHeaderButton,
  MainHeader,
  MoreMainHeaderButton,
} from "../../MainHeader"
import { NewButton } from "../../PrimarySidebarBottomButton"
import { CloudDocumentSidebarItem } from "../../SidebarDocumentItem"

import { useGenericDocumentsFromCloudDocumentsQuery } from "../hooks"

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

  const { data: tag, isLoading: isTagLoading } = useRxSubscription(
    db.tags.findOne().where("id").eq(tagId)
  )

  // =======================================================================

  const docsQuery = useQueryWithSorting(
    (db, sorting) =>
      db.documents
        .findNotRemoved()
        .where("tags")
        .elemMatch({ $eq: tagId })
        .sort({ [sorting.index]: sorting.direction }),
    [tagId]
  )

  const [flatDocuments] = useGenericDocumentsFromCloudDocumentsQuery(docsQuery)

  // =======================================================================

  const ok = !!flatDocuments && !!tag

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
        {!isTagLoading ? (
          <FlatDocumentsList
            documents={flatDocuments}
            DocumentItemComponent={CloudDocumentSidebarItem}
          />
        ) : null}
      </InnerContainer>
      {/* TODO:  Rework NewButton to work with tags as well as groups, or create additional variants */}
      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  ) : null
}
