import React from "react"
import styled from "styled-components/macro"

import StaticTreeItem from "../TreeItem"
import { useMainState } from "../MainStateProvider"

// TODO: move common components out of the sidebar direcotory
import GroupTreeItem from "../Sidebar/GroupTreeItem"
import { useViewState } from "../ViewStateProvider"
import { VIEWS } from "../Sidebar/types"

export const NavigatorSidebar: React.FC<{}> = () => {
  const { groups } = useMainState()
  const { primarySidebar } = useViewState()

  return (
    <OuterContainer>
      <SectionHeader>Library</SectionHeader>

      <StaticTreeItem
        icon="cloud"
        onClick={() => primarySidebar.switchView(VIEWS.ALL)}
      >
        All Documents
      </StaticTreeItem>

      <SectionHeader>Collections</SectionHeader>

      {groups.map((group) => (
        <GroupTreeItem key={group.id} group={group} />
      ))}
    </OuterContainer>
  )
}

const OuterContainer = styled.div`
  font-size: 12px;
  border-right: 1px solid;
  border-color: #383838;
  background-color: #171717;
`

const SectionHeader = styled.div`
  font-family: Poppins;
  font-weight: bold;
  font-size: 10px;
  color: #a3a3a3;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 16px 20px 5px;

  user-select: none;
`

// const InnerContainer = styled.div`
//   padding-left: 20px;
// `
