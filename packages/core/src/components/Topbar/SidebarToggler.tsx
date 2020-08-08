import React from "react"
import styled from "styled-components/macro"

import Icon from "../Icon"
import { useViewState } from "../View/ViewStateProvider"

export const SidebarToggler: React.FC = () => {
  const { primarySidebar, navigatorSidebar } = useViewState()
  return (
    <IconContainer
      onClick={() => {
        primarySidebar.toggle()
      }}
      onContextMenu={(e) => {
        // TODO: remove this if I ever implement the auto-hiding behavior and/or replace it with a context menu for controlling other view-related stuff
        e.preventDefault()
        navigatorSidebar.toggle()
      }}
    >
      <Icon icon="sidebarLeft" />
    </IconContainer>
  )
}

const IconContainer = styled.div`
  color: #6a6a6a;
  font-size: 18px;
  line-height: 18px;
  padding: 6px;
  margin: -6px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 3px;

  transition: all 100ms ease;

  &:hover {
    background-color: #353535;
    color: #b8b8b8;
  }

  &:active {
    background-color: #2a2a2a;
    color: #b8b8b8;
  }
`
