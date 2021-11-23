import { SectionHeader, SectionContainer } from "./Common"

import { useRxSubscription, useToggleable } from "../../hooks"
import { TagDoc, useDatabase } from "../Database"
import { GenericTreeItem } from "../TreeItem"
import { EditableText, useEditableText } from "../RenamingInput"
import { ContextMenuItem, useContextMenu } from "../ContextMenu"
import { useTagsAPI } from "../MainProvider/context"
import { useViewState } from "../ViewState"

/* The number of tags displayed without toggling */
const LIMIT_TAGS = 4
const MSG_TAGS = "Tags"
const MSG_SHOW_MORE = "Show More"
const MSG_SHOW_LESS = "Show Less"
export const TagsSection: React.FC = () => {
  const db = useDatabase()

  const { isOpen, toggle } = useToggleable(false)
  const { data: tags, isLoading } = useRxSubscription(db.tags.find())

  const hasTags = !isLoading && tags && tags.length > 0

  return hasTags ? (
    <SectionContainer>
      <SectionHeader>{MSG_TAGS}</SectionHeader>

      {tags.map((tag, index) =>
        isOpen || index < LIMIT_TAGS ? (
          <TagTreeItem key={tag.id} tag={tag} />
        ) : null
      )}

      {tags.length > LIMIT_TAGS ? (
        <GenericTreeItem
          depth={0}
          onClick={() => {
            toggle()
          }}
          icon="ellipsisHorizontal"
        >
          {isOpen ? MSG_SHOW_LESS : MSG_SHOW_MORE}
        </GenericTreeItem>
      ) : null}
    </SectionContainer>
  ) : null
}

const TagTreeItem: React.FC<{ tag: TagDoc }> = ({ tag }) => {
  const { actuallyPermanentlyDeleteTag, renameTag } = useTagsAPI()
  const { primarySidebar } = useViewState()

  const { openMenu, closeMenu, ContextMenu } = useContextMenu()

  const { startRenaming, getProps: getRenamingInputProps } = useEditableText(
    tag.name,
    (value: string) => {
      renameTag(tag.id, value)
    }
  )

  const handleRename = () => {
    closeMenu()
    startRenaming()
  }

  const handleDelete = async () => {
    // TODO: add a confirmation dialog
    try {
      await actuallyPermanentlyDeleteTag(tag.id)
    } catch (e) {
      // TODO: better surface this error to the user
      console.log("error while deleting document")
      throw e
    }
  }

  const handleClick = () => {
    primarySidebar.switchSubview("cloud", "tag", tag.id)
  }

  return (
    <>
      <GenericTreeItem
        key={tag.id}
        depth={0}
        onContextMenu={openMenu}
        onClick={handleClick}
        // isActive={isActive}
        icon="tag"
      >
        <EditableText {...getRenamingInputProps()}>{tag.name}</EditableText>
      </GenericTreeItem>

      <ContextMenu>
        <ContextMenuItem onClick={handleRename}>Rename</ContextMenuItem>
        <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
      </ContextMenu>
    </>
  )
}

export default TagsSection
