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

export const customScrollbar = css`
  ::-webkit-scrollbar {
    width: 6px;
  }

  &:hover {
    ::-webkit-scrollbar-thumb {
      background-color: var(--dark-500);

      :hover {
        background-color: var(--dark-600);
      }
    }
  }
`

export const ANIMATION_SPIN = keyframes`
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
`

export const ANIMATION_FADEIN = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`
