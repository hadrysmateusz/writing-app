import React, { useEffect, useMemo } from "react"

import useRxSubscription from "../../../../hooks/useRxSubscription"
import { formatOptional } from "../../../../utils"

import { DocumentsList, MainHeader } from "../../../DocumentsList"
import { useDatabase } from "../../../Database"
import { useMainState } from "../../../MainProvider"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import {
  parseSidebarPath,
  SIDEBAR_VAR,
  usePrimarySidebar,
} from "../../../ViewState"

import { NewButton } from "../../NewButton"

import { SubGroups } from "../SubGroups"
import { createFindDocumentsInGroupQuery } from "../queries"
import { useFindGroupAndChildGroups } from "../helpers"

export const GroupView: React.FC = () => {
  const { currentSubviews } = usePrimarySidebar()

  // calculate this in ViewStateProvider along with other path properties
  const groupId = useMemo(() => parseSidebarPath(currentSubviews.cloud)?.id, [
    currentSubviews.cloud,
  ])

  console.log("groupId", groupId)

  return groupId ? <GroupViewWithFoundGroupId groupId={groupId} /> : null
}

const GroupViewWithFoundGroupId: React.FC<{ groupId: string }> = ({
  groupId,
}) => {
  const db = useDatabase()
  const { switchSubview } = usePrimarySidebar()
  const { sorting } = useMainState()

  const { group, childGroups } = useFindGroupAndChildGroups(groupId)

  const ok = !!group && !!childGroups

  // If the group wasn't found, switch to more general sidebar view
  useEffect(() => {
    if (!ok) {
      switchSubview("cloud", "all")
    }
  }, [ok, switchSubview])

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsInGroupQuery(db, sorting, groupId)
  )

  const goUpPath = group?.parentGroup
    ? `${SIDEBAR_VAR.primary.cloud.group}_${group.parentGroup}`
    : SIDEBAR_VAR.primary.cloud.all

  return ok ? (
    <PrimarySidebarViewContainer>
      <MainHeader
        title={formatOptional(group.name, "Unnamed Collection")}
        goUpPath={goUpPath}
        numSubgroups={childGroups.length}
      />
      <InnerContainer>
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
