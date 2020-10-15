import React from "react"
import styled from "styled-components/macro"

import Icon from "../Icon"
import { useViewState } from "../ViewState"

export const SidebarToggler: React.FC<{ which: "primary" | "secondary" }> = ({
  which,
}) => {
  const { primarySidebar, secondarySidebar, navigatorSidebar } = useViewState()

  const sidebar = { primary: primarySidebar, secondary: secondarySidebar }[
    which
  ]

  const icon = { primary: "sidebarLeft", secondary: "sidebarRight" }[which]

  return (
    <IconContainer
      onClick={() => {
        sidebar.toggle()
      }}
      onContextMenu={(e) => {
        if (which === "primary") {
          // TODO: remove this if I ever implement the auto-hiding behavior and/or replace it with a context menu for controlling other view-related stuff
          e.preventDefault()
          navigatorSidebar.toggle()
        }
      }}
    >
      <Icon icon={icon} />
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
