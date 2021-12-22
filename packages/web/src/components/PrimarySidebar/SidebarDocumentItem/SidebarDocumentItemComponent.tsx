import React, { useMemo } from "react"
import moment from "moment"

import { useRxSubscription } from "../../../hooks"

import { EditableText, EditableTextProps } from "../../RenamingInput"
import { LocalSettings, useDatabase } from "../../Database"

import {
  DateModified,
  GroupName,
  MainContainer,
  Snippet,
  TagAltContainer,
  TagsContainer,
  Title,
} from "./SidebarDocumentItemComponent.styles"

export const SidebarDocumentItemComponent: React.FC<{
  listType?: LocalSettings["documentsListDisplayType"]
  title: string
  snippet?: string
  modifiedAt: number
  createdAt: number
  isCurrent: boolean
  tags?: string[]
  groupName?: string // TODO: probably rename with something local/cloud generic
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void
  getEditableProps?: () => EditableTextProps
}> = ({
  listType,
  title,
  snippet,
  modifiedAt,
  createdAt,
  isCurrent,
  tags,
  groupName,
  onClick,
  onContextMenu,
  getEditableProps,
}) => {
  // TODO: replace moment with a more lightweight solution
  const formattedModifiedAt = useMemo(
    () => moment(modifiedAt).format("LL"),
    [modifiedAt]
  )
  const formattedCreatedAt = useMemo(
    () => moment(createdAt).format("LL"),
    [createdAt]
  )

  // Whether the grouping item name should be shown depends on current listType
  const parentGroupingItemName = useMemo(() => {
    return listType === "flat_list" ? groupName : undefined
  }, [groupName, listType])

  const hasSnippet = snippet ? snippet.trim().length > 0 : false
  const dateModifiedTooltip = `Modified at: ${formattedModifiedAt}\nCreated at: ${formattedCreatedAt}`

  return (
    <MainContainer
      onClick={onClick}
      onContextMenu={onContextMenu}
      isCurrent={isCurrent}
    >
      {parentGroupingItemName ? (
        <GroupName>{parentGroupingItemName}</GroupName>
      ) : null}
      <Title isUnsynced={/* isUnsynced */ false}>
        {getEditableProps ? (
          <EditableText {...getEditableProps()}>{title}</EditableText>
        ) : (
          title
        )}
      </Title>

      {/* {isCurrent ? (
        <Outline />
      ) : ( */}
      <>
        {hasSnippet ? <Snippet>{snippet}</Snippet> : null}
        <DateModified title={dateModifiedTooltip}>
          {formattedModifiedAt}
        </DateModified>
        {tags && tags.length > 0 ? <TagsList tags={tags} /> : null}
      </>
      {/* )} */}
    </MainContainer>
  )
}

// TODO: extract this for general use and also expose a list of all tags through context to reduce queries/subscriptions across the app
const TagsList: React.FC<{ tags: string[] }> = ({ tags }) => {
  const db = useDatabase()
  const { data: allTags } = useRxSubscription(db.tags.find())

  return allTags ? (
    <TagsContainer>
      {tags.map((tagId) => (
        // <Tag tagId={tagId} key={tagId}>
        //   {allTags.find((tag) => tag.id === tagId)?.name || "..."}
        // </Tag>
        <TagAlt key={tagId}>
          {allTags.find((tag) => tag.id === tagId)?.name || "..."}
        </TagAlt>
      ))}
    </TagsContainer>
  ) : null
}

// TODO: extract this
const TagAlt: React.FC = ({ children }) => {
  return <TagAltContainer>{children}</TagAltContainer>
}

export default SidebarDocumentItemComponent
