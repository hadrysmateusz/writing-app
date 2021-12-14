import { Section, SecondarySidebarViewContainer } from "../../SidebarCommon"
import { useTabsState } from "../../TabsProvider"

import TextStats from "../TextStats"
import Keywords from "../Keywords"
import { Outline } from "../Outline"

export const DashboardView: React.FC = () => {
  const { currentTabType } = useTabsState()

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
