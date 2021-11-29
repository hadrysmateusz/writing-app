import React from "react"

import { Section, SecondarySidebarViewContainer } from "../../SidebarCommon"

import TextStats from "../TextStats"
import { Outline } from "../Outline"
import Keywords from "../Keywords"
import { useTabsState } from "../../MainProvider"

export const DashboardView: React.FC = () => {
  const { tabs, currentTab } = useTabsState()

  let currentTabObj = tabs[currentTab]
  // TODO: probably precompute this and expose in useTabsState hook
  const currentTabType = currentTabObj.tabType

  return (
    <SecondarySidebarViewContainer>
      <Section title="Progress">
        <div>
          <TextStats />
        </div>
      </Section>

      {/* Only render keywords section for cloud documents as the system doesn't support other types  */}
      {currentTabType === "cloudDocument" ? (
        <Section title="Keywords">
          <div>
            <Keywords />
          </div>
        </Section>
      ) : null}

      <Section title="Outline">
        <div>
          <Outline />
        </div>
      </Section>
    </SecondarySidebarViewContainer>
  )
}
