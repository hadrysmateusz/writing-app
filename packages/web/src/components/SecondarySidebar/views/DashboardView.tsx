import React from "react"

import { Section, SecondarySidebarViewContainer } from "../../SidebarCommon"
import TextStats from "../../TextStats"

import { Outline } from "../Outline"

export const DashboardView: React.FC = () => {
  return (
    <SecondarySidebarViewContainer>
      <Section title="Progress">
        <div>
          <TextStats />
        </div>
      </Section>

      <Section title="Keywords">
        <div></div>
      </Section>

      <Section title="Outline">
        <div>
          <Outline />
        </div>
      </Section>
    </SecondarySidebarViewContainer>
  )
}
