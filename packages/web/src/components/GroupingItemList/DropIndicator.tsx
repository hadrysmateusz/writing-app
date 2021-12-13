import styled, { css } from "styled-components/macro"

import { HoverState } from "./types"

export const DropIndicator = styled.div<{
  state: HoverState
  visible: boolean
}>`
  left: 0;
  right: 0;
  position: absolute;
  user-select: none;
  pointer-events: none;
  z-index: 500;
  transition: opacity 200ms ease-out;
  opacity: ${(p) => (p.visible ? "1" : "0")};

  ${(p) => {
    if (p.state === HoverState.above) {
      return css`
        top: -2px;
        height: 4px;
        background: rgba(40, 147, 235, 0.5);
      `
    } else if (p.state === HoverState.below) {
      return css`
        bottom: -2px;
        height: 4px;
        background: rgba(40, 147, 235, 0.5);
      `
      // This condition is required to avoid visual issues with rendering the "inside" styles when state is "outside" but the visibility isn't reset yet
    } else if (p.state === HoverState.inside) {
      return css`
        top: 0;
        background: rgba(40, 147, 235, 0.25);
        height: 100%;
      `
    } else {
      return css`
        background: none;
      `
    }
  }};
`

export default DropIndicator
