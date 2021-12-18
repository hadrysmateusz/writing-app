import styled from "styled-components/macro"

import { menuContainerCommon } from "../ContextMenu/Common"

export const DropdownContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;

  min-width: 0;
  padding: 6px 20px;
  margin: 0;
  border: 1px solid;
  border-radius: 3px;

  font-weight: 500;
  font-size: 12px;
  font-family: "Poppins";

  transition-property: background-color, color, border-color, background-image;
  transition-duration: 0.15s;
  transition-timing-function: ease;

  border-color: var(--dark-500);
  background: transparent;
  color: var(--light-400);
  position: relative;
  cursor: pointer;
  user-select: none;

  span {
    margin-right: 6px;
  }
`

export const DropdownContent = styled.div`
  /* Base styles */
  position: absolute;
  /* left: 100%; */
  top: -7px; /* based on the padding of the the container and border width */
  max-height: 322px;
  overflow-y: auto;

  /* Visual styles */
  ${menuContainerCommon}
`
