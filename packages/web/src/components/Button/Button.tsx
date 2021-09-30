import styled, { css } from "styled-components/macro"

import { ellipsis } from "../../style-utils"

const variants = {
  default: css`
    border-color: #383838;
    background: transparent;
    color: #c8c8c8;

    &:not([disabled]) {
      &:hover {
        background: #212121;
        border-color: #383838;
      }
    }
  `,
  primary: css`
    /* border-color: var(--black0);
    background: var(--black0);
    color: white;

    &:not([disabled]) {
      &:hover {
        background: var(--black50);
        border-color: var(--black50);
      }
    } */
  `,
  accent: css`
    border-color: #c46179;
    background: #c46179;
    color: #e4e4e4;

    /* text-shadow: 1px 1px rgba(0, 0, 0, 0.23), 0 0 5px rgba(0, 0, 0, 0.1); */

    :not([disabled]) {
      :hover {
        background: #d17088;
        border-color: #d17088;
      }
    }
  `,
  danger: css`
    border-color: #db4141;
    background: #db4141;
    color: white;

    &:not([disabled]) {
      &:hover {
        border-color: #db4141;
        background: #db4141;
        color: white;
      }
    }
  `,
}

const disabled = css`
  /* border-color: var(--gray100);
  background: var(--almost-white);
  color: var(--gray50);
  font-weight: normal; */
`

const fullWidth = css`
  width: 100%;
`

const getVariant = (name: string = "default") => {
  const variant = variants[name]
  if (!variant) {
    throw Error(`Invalid variant: ${name}`)
  }
  return variant
}

type ButtonProps = {
  /** A named variant. Can only be one at a time */
  variant?: string
  /** Makes the button take up all available horizontal space */
  fullWidth?: boolean
}

export const Button = styled.button<ButtonProps>`
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

	/* Add spacing between children */
	> * + * {
		margin-left: 16px;
	}

	/* Change cursor if button isn't disabled */
  cursor: ${(p) => (p.disabled ? "default" : "pointer")};

	/* Variant styles */
	${(p) => getVariant(p.variant)}

	/* Disabled styles */
	${(p) => p.disabled && disabled}

  /* Full-width styles */
	${(p) => p.fullWidth && fullWidth}

	/* Prevent text overflow */
	${ellipsis}
`
