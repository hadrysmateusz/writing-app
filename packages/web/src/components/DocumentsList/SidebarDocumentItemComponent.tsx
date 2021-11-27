import React, { useMemo } from "react"
import moment from "moment"

import { EditableText, EditableTextProps } from "../RenamingInput"

import {
  DateModified,
  MainContainer,
  Snippet,
  Title,
} from "./SidebarDocumentItemComponent.styles"

export const SidebarDocumentItemComponent: React.FC<{
  title: string
  snippet?: string
  modifiedAt: number
  createdAt: number
  isCurrent: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void
  getEditableProps?: () => EditableTextProps
}> = ({
  title,
  snippet,
  modifiedAt,
  createdAt,
  isCurrent,
  onClick,
  onContextMenu,
  getEditableProps,
}) => {
  // TODO: replace moment with a more lightweight solution
  const formattedModifiedAt = useMemo(() => moment(modifiedAt).format("LL"), [
    modifiedAt,
  ])
  const formattedCreatedAt = useMemo(() => moment(createdAt).format("LL"), [
    createdAt,
  ])

  const hasSnippet = snippet ? snippet.trim().length > 0 : false
  const dateModifiedTooltip = `Modified at: ${formattedModifiedAt}\nCreated at: ${formattedCreatedAt}`

  return (
    <MainContainer
      onClick={onClick}
      onContextMenu={onContextMenu}
      isCurrent={isCurrent}
    >
      <Title isUnsynced={/* isUnsynced */ false}>
        {getEditableProps ? (
          <EditableText {...getEditableProps()}>{title}</EditableText>
        ) : (
          title
        )}
      </Title>
      {hasSnippet ? <Snippet>{snippet}</Snippet> : null}
      <DateModified title={dateModifiedTooltip}>
        {formattedModifiedAt}
      </DateModified>
    </MainContainer>
  )
}

export default SidebarDocumentItemComponent
