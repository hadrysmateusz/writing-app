import { FC } from "react"
import styled from "styled-components/macro"

import Icon from "../Icon"

const SidebarTab: FC<{
  icon: string
  isActive: boolean
  onClick: () => void
}> = ({ icon, ...props }) => {
  return (
    <SidebarTabContainer {...props}>
      <Icon icon={icon} />
    </SidebarTabContainer>
  )
}

const SidebarTabContainer = styled.div<{ isActive: boolean }>`
  width: var(--tab-size);
  height: var(--tab-size);
  background: var(--bg-300);
  border-radius: var(--tab-corner-radius) var(--tab-corner-radius) 0 0;

  display: flex;
  justify-content: center;
  align-items: center;

  color: ${(p) => (p.isActive ? "#7D7D7D" : "#545454")};
  background: ${(p) => (p.isActive ? "#1E1E1E" : "transparent")};
  cursor: ${(p) => (p.isActive ? "default" : "pointer")};
`

export default SidebarTab
