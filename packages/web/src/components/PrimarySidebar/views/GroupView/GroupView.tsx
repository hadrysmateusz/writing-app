import React, { useMemo } from "react"

import useRxSubscription from "../../../../hooks/useRxSubscription"
import { formatOptional } from "../../../../utils"

import { DocumentsList, MainHeader } from "../../../DocumentsList"
import { useDatabase } from "../../../Database"
import { useMainState } from "../../../MainProvider"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import { parseSidebarPath, useViewState } from "../../../ViewState"

import { NewButton } from "../../NewButton"

import { SubGroups } from "../SubGroups"
import { createFindDocumentsInGroupQuery } from "../queries"

import { useFindGroupAndChildGroups } from "./helpers"

export const GroupView: React.FC = () => {
  const { primarySidebar } = useViewState()

  // calculate this in ViewStateProvider along with other path properties
  const groupId = useMemo(
    () => parseSidebarPath(primarySidebar.currentSubviews.cloud)?.id,
    [primarySidebar.currentSubviews.cloud]
  )

  console.log("groupId", groupId)

  return groupId ? <GroupViewWithFoundGroupId groupId={groupId} /> : null
}

const GroupViewWithFoundGroupId: React.FC<{ groupId: string }> = ({
  groupId,
}) => {
  const db = useDatabase()
  // const { primarySidebar } = useViewState()
  const { sorting } = useMainState()

  const { group, childGroups } = useFindGroupAndChildGroups(groupId)

  const ok = !!group && !!childGroups

  // // If the group wasn't found, switch to more general sidebar view
  // useEffect(() => {
  //   if (!ok) {
  //     primarySidebar.switchSubview("cloud", "all")
  //   }
  // }, [ok, primarySidebar])

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsInGroupQuery(db, sorting, groupId)
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
            <DocumentsList documents={documents || []} />
            {childGroups ? <SubGroups groups={group.children} /> : null}
          </>
        ) : null}
      </InnerContainer>
      <NewButton groupId={groupId} />
    </PrimarySidebarViewContainer>
  ) : null
}
