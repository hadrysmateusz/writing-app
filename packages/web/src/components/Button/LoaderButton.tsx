import React from "react"
import styled from "styled-components/macro"

import { ANIMATION_SPIN } from "../../style-utils"
import Icon from "../Icon"
import { Button } from "./Button"

const LoaderButtonUnstyled: React.FC<{
  isLoading: boolean
  text: string
  loadingText: string
}> = ({
  children,
  text = children,
  loadingText = text,
  isLoading,
  ...rest
}) => (
  <Button {...rest}>
    <span className="LoaderButton_contentContainer">
      <span className="LoaderButton_spinner">
        {isLoading && <Icon icon="spinner" />}
      </span>
      <span className="LoaderButton_text">
        {isLoading ? loadingText : text}
      </span>
    </span>
  </Button>
)

export const LoaderButton = styled(LoaderButtonUnstyled)`
  .contentContainer {
    position: relative;
    width: auto;
  }
  .spinner {
    margin-right: var(--spacing2);
    position: absolute;
    top: 0.2rem;
    left: -1.3rem;
    animation: ${ANIMATION_SPIN} 1.3s linear infinite;
  }
`
