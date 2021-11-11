import styled from "styled-components/macro"

type ToggleButtonProps = {
  isSidebarOpen: boolean
  leftSide: boolean
}

export const SidebarToggleButton = styled.div<ToggleButtonProps>`
  --sidebar-toggle-size: 20px;
  --sidebar-toggle-color: var(--dark-500);

  height: var(--sidebar-toggle-size);
  width: var(--sidebar-toggle-size);

  cursor: pointer;

  /* Positions the toggler next to the sidebar */
  position: absolute;
  bottom: 16px;
  ${(p) =>
    p.leftSide
      ? `left: calc(-1 * calc(16px + var(--sidebar-toggle-size)));`
      : `right: calc(-1 * calc(16px + var(--sidebar-toggle-size)));`}

  /* Creates the inner circle */
  ${(p) => p.isSidebarOpen && `background-color: var(--sidebar-toggle-color);`}
  background-clip: content-box;
  padding: 2px;

  /* Creates the outer circle */
  border-radius: 50%;
  border: 2px solid var(--sidebar-toggle-color);
`
