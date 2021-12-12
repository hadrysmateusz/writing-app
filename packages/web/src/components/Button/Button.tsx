import styled, {
  css,
  FlattenSimpleInterpolation,
} from "styled-components/macro"

import { ellipsis } from "../../style-utils"

export type ButtonVariants = "default" | "primary" | "accent" | "danger"

const variants: Record<ButtonVariants, FlattenSimpleInterpolation> = {
  // TODO: finish default conditional styles
  default: css`
    color: var(--light-400);
    border-color: var(--dark-500);
    background: transparent;

    &:not([disabled]) {
      &:hover {
        border-color: var(--dark-500);
        background: var(--dark-400);
      }
      &:focus,
      &:focus-within {
        border-color: var(--dark-600);
      }
    }

    &[disabled] {
      color: var(--light-100);
    }
  `,
  primary: css`
    border-color: var(--dark-600);
    background: var(--dark-500);
    color: var(--light-400);

    &:not([disabled]) {
      &:hover {
        background: #3c3c3c;
        border-color: var(--dark-600);
      }
      &:focus {
        border-color: #6a6a6a;
      }
    }
    &[disabled] {
      color: var(--light-100);
      background: var(--dark-400);
      border-color: var(--dark-500);
    }
  `,
  // TODO: add disabled and focus styles
  danger: css`
    border-color: var(--danger-200);
    background: var(--danger-200);
    color: white;

    &:not([disabled]) {
      &:hover {
        border-color: var(--danger-200);
        background: var(--danger-200);
        color: white;
      }
    }
  `,
  // TODO: consider the necessity of this one
  accent: css`
    /* border-color: #c46179;
    background: #c46179;
    color: var(--light-500); */

    /* text-shadow: 1px 1px rgba(0, 0, 0, 0.23), 0 0 5px rgba(0, 0, 0, 0.1); */

    /* :not([disabled]) {
      :hover {
        background: #d17088;
        border-color: #d17088;
      }
    } */
  `,
}

// TODO: either move back to this solution or shift completely to per-variant disabled styles and removeThis
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
  variant?: ButtonVariants
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
	${ellipsis};
`
