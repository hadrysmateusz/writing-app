import { useCallback } from "react"

import { GenericTreeItem } from "../TreeItem"
import { EditableText, useEditableText } from "../RenamingInput"
import { ContextMenuItem, useContextMenu } from "../ContextMenu/Old"
import { parseSidebarPath, usePrimarySidebar } from "../ViewState"
import { useTagsAPI } from "../TagsProvider"

export const TagTreeItem: React.FC<{ tagId: string; tagName: string }> = ({
  tagId,
  tagName,
}) => {
  const { permanentlyDeleteTag, renameTag } = useTagsAPI()
  const { switchSubview, currentSubviews, currentView } = usePrimarySidebar()

  const { openMenu, closeMenu, ContextMenu } = useContextMenu()

  const handleRenameSubmit = useCallback(
    (value: string) => {
      renameTag(tagId, value)
    },
    [renameTag, tagId]
  )

  const { startRenaming, getProps: getRenamingInputProps } = useEditableText(
    tagName,
    handleRenameSubmit
  )

  const handleRename = useCallback(() => {
    closeMenu()
    startRenaming()
  }, [closeMenu, startRenaming])

  const handleDelete = useCallback(async () => {
    await permanentlyDeleteTag(tagId)
  }, [permanentlyDeleteTag, tagId])

  const handleClick = useCallback(
    async (_e) => {
      await switchSubview("cloud", "tag", tagId)
    },
    [switchSubview, tagId]
  )

  const isActive = parseSidebarPath(currentSubviews[currentView])?.id === tagId

  return (
    <>
      <GenericTreeItem
        key={tagId}
        depth={0}
        onContextMenu={openMenu}
        onClick={handleClick}
        isActive={isActive}
        icon="tag"
      >
        <EditableText {...getRenamingInputProps()}>{tagName}</EditableText>
      </GenericTreeItem>

      <ContextMenu>
        <ContextMenuItem onClick={handleRename}>Rename</ContextMenuItem>
        <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
      </ContextMenu>
    </>
  )
}

export default TagTreeItem
