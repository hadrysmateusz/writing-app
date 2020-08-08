import { css, keyframes } from "styled-components/macro"

export const ellipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const resetButtonStyles = css`
  padding: 0;
  background: none;
  border: none;
  box-shadow: none;
  display: block;
  border-radius: 0;
  outline: none;
  cursor: pointer;
`

export const ANIMATION_SPIN = keyframes`
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
`
