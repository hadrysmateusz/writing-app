import React from "react"
import styled from "styled-components/macro"
import Icon from "../Icon"
import { UnstyledButton } from "../Button"
import { useDocumentsAPI } from "../MainProvider"
import { ANIMATION_FADEIN } from "../../style-utils"

export const TreeItem_AddDocumentButton = "TreeItem_AddDocumentButton"

// TODO: probably replace this to some degree with GenericAddButton (maybe make this a wrapper over it)
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
    createDocument({ parentGroup: groupId })
  }

  return (
    <AddButtonComponent title={tooltip} onClick={handleClick}>
      <Icon icon="plus" />
    </AddButtonComponent>
  )
}

export const GenericAddButton: React.FC<{
  tooltip?: string
  onAdd: () => void
}> = ({
  // TODO: create custom tooltips that better match the style of the app
  tooltip = "Add a document inside",
  onAdd,
}) => {
  const handleClick = () => {
    onAdd()
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
  color: var(--light-100);
  border: 1px solid var(--dark-500);
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
  animation: 200ms ease-out both ${ANIMATION_FADEIN};

  :hover {
    color: var(--light-200);
    background: var(--dark-500);
  }
`
