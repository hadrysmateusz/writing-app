import React from "react"
import styled, { keyframes } from "styled-components/macro"
import Icon from "../Icon"
import { UnstyledButton } from "../Button"
import { useDocumentsAPI } from "../MainProvider"

const fadein = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

export const TreeItem_AddDocumentButton = "TreeItem_AddDocumentButton"

export const AddButton: React.FC<{
  tooltip?: string
  groupId: string | null
}> = ({
  // TODO: create custom tooltips that better match the style of the app
  tooltip = "Add a document inside",
  groupId,
}) => {
  const { createDocument } = useDocumentsAPI()

  const handleClick = () => {
    createDocument(groupId)
  }

  return (
    <AddButtonComponent title={tooltip} onClick={handleClick}>
      <Icon icon="plus" />
    </AddButtonComponent>
  )
}

const AddButtonComponent = styled(UnstyledButton).attrs({
  className: "TreeItem_AddDocumentButton",
})`
  color: #707070;
  border: 1px solid #4d4d4d;
  border-radius: 3px;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-bottom: -2px;
  margin-left: 3px;
  align-items: center;
  justify-content: center;
  display: none;

  transition: background 200ms ease;
  animation: 200ms ease-out both ${fadein};

  :hover {
    color: #838383;
    background: #343434;
  }
`
