import { FC } from "react"
import styled, { css } from "styled-components/macro"

import Icon from "../Icon"

const SidebarTab: FC<{
  icon: string
  isActive: boolean
  onClick: () => void
  rightSide?: boolean
  title?: string
}> = ({ icon, rightSide = false, title, ...props }) => {
  return (
    <SidebarTabContainer rightSide={rightSide} title={title} {...props}>
      <Icon icon={icon} />
    </SidebarTabContainer>
  )
}

const SidebarTabContainer = styled.div<{
  isActive: boolean
  rightSide?: boolean
  title?: string
}>`
  width: var(--tab-size);
  height: var(--tab-size);
  background: var(--bg-300);
  border-radius: var(--tab-corner-radius) var(--tab-corner-radius) 0 0;

  display: flex;
  justify-content: center;
  align-items: center;

  color: ${(p) => (p.isActive ? "var(--light-100)" : "var(--dark-600)")};
  background: ${(p) => (p.isActive ? "var(--dark-300)" : "transparent")};
  cursor: pointer;

  &:hover {
    color: #7d7d7d; // TODO: create color variants for hover and active effects
    background: #1d1d1d; // TODO: create color variants for hover and active effects
  }

  /* TODO: make this work with more than one tab */
  ${(p) =>
    p.rightSide &&
    css`
      &:last-child,
      &:last-child:hover {
        margin-left: auto;
        background: transparent;
      }
    `}
`

export default SidebarTab
