import React from "react"
import styled from "styled-components/macro"

const StyledButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  border-radius: none;
  padding: 6px;
  color: ${(p) => (p.active ? "#EC92A8" : "#AFB3B6")};
`

const Button: React.FC<{
  active: boolean
  onMouseDown: (event: React.MouseEvent) => void
}> = ({ active, onMouseDown, ...props }) => {
  // this styling only works when the svg has fill & stroke set to "currentColor" and all fills and paths are removed from the paths inside it
  return <StyledButton active={active} onMouseDown={onMouseDown} {...props} />
}

export default Button
