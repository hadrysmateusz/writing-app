import React from "react"
import styled from "styled-components/macro"

import Icon from "../Icon"

import { SidebarToggler } from "./SidebarToggler"
import { GroupDisplay } from "./GroupDisplay"
import { DocumentTitle } from "./DocumentTitle"
import { ExportButton } from "./ExportButton"

export const Topbar: React.FC = () => {
  return (
    <TopbarContainer>
      <SidebarToggler which="primary" />

      <GroupDisplay />

      <SeparatorContainer>
        <Icon icon={"caretRight"} />
      </SeparatorContainer>

      <DocumentTitle />

      <RightSideContainer>
        <ExportButton />
        <SidebarToggler which="secondary" />
      </RightSideContainer>
    </TopbarContainer>
  )
}

const RightSideContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  height: 100%;
  > * + * {
    margin-left: 12px;
  }
`

const SeparatorContainer = styled.div`
  color: #545454;
  font-size: 10px;
  margin: 0 10px;
`

const TopbarContainer = styled.div`
  user-select: none;
  height: var(--topbar-height);
  width: 100%;
  padding: 10px 20px;
  border-bottom: 1px solid #363636;

  font-family: Poppins;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;

  display: flex;
  align-items: center;

  color: #e4e4e4;
`
