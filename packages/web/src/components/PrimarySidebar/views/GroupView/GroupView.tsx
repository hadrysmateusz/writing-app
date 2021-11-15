import React, { useEffect } from "react"

import useRxSubscription from "../../../../hooks/useRxSubscription"
import { formatOptional } from "../../../../utils"

import { DocumentsList, MainHeader } from "../../../DocumentsList"
import { useDatabase } from "../../../Database"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import {
  useViewState,
  PrimarySidebarViews,
  CloudViews,
} from "../../../ViewState"

import { NewButton } from "../../NewButton"

import {
  createFindDocumentsInGroupQuery,
  useFindGroupAndChildGroups,
} from "./helpers"
import { SubGroups } from "./SubGroups"
import { useMainState } from "../../../MainProvider"

export const GroupView: React.FC = () => {
  const db = useDatabase()
  const { primarySidebar } = useViewState()
  const { sorting } = useMainState()

  const groupId = primarySidebar.currentSubviews.cloud

  const { group, childGroups } = useFindGroupAndChildGroups(groupId)

  const ok = !!group && !!childGroups

  // If the group wasn't found, switch to more general sidebar view
  useEffect(() => {
    if (!ok) {
      primarySidebar.switchSubview(PrimarySidebarViews.cloud, CloudViews.ALL)
    }
  }, [ok, primarySidebar])

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsInGroupQuery(db, groupId).sort({
      [sorting.index]: sorting.direction,
    })
  )

  return ok ? (
    <PrimarySidebarViewContainer>
      <MainHeader
        title={formatOptional(group.name, "Unnamed Collection")}
        parentGroupId={group.parentGroup}
        numSubgroups={childGroups.length}
      />
      <InnerContainer groupId={groupId}>
        {!isLoading ? (
          <>
            <DocumentsList documents={documents || []} groupId={group.id} />
            {childGroups ? <SubGroups groups={group.children} /> : null}
          </>
        ) : null}
      </InnerContainer>
      <NewButton groupId={groupId} />
    </PrimarySidebarViewContainer>
  ) : null
}
