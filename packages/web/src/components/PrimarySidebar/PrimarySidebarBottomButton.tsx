import React from "react"
import styled from "styled-components/macro"

import Icon from "../Icon"

export const PrimarySidebarBottomButton: React.FC<{
  icon: string
  handleClick: () => void
}> = ({ icon, handleClick, children }) => (
  <PrimarySidebarBottomButtonSC onClick={handleClick}>
    <Icon icon={icon} color="#858585" style={{ fontSize: "1.5em" }} />
    <div>{children}</div>
  </PrimarySidebarBottomButtonSC>
)

const PrimarySidebarBottomButtonSC = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  width: 100%;
  padding: 18px 20px 16px;

  user-select: none;
  cursor: pointer;

  font: 500 13px poppins;
  background: var(--bg-highlight);
  color: #e4e4e4;

  :hover {
    color: white;
  }
`
