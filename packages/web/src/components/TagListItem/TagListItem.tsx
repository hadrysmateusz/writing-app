import { useCallback } from "react"

import { Icon } from "../Icon"
import { EditableText, useEditableText } from "../RenamingInput"
import { useTagsAPI } from "../TagsProvider"
import { usePrimarySidebar } from "../ViewState"

import { TagListItemContainer } from "./TagListItem.styles"

export const TagListItem: React.FC<{
  id: string
  name: string
  numDocs: number | null
}> = ({ id, name, numDocs }) => {
  const { permanentlyDeleteTag, renameTag } = useTagsAPI()
  const { switchSubview } = usePrimarySidebar()

  const handleRenameSubmit = useCallback(
    (value: string) => {
      renameTag(id, value)
    },
    [renameTag, id]
  )

  const { startRenaming, getProps: getRenamingInputProps } = useEditableText(
    name,
    handleRenameSubmit
  )

  const handleRename = useCallback(() => {
    startRenaming()
  }, [startRenaming])

  const handleDelete = useCallback(async () => {
    await permanentlyDeleteTag(id)
  }, [permanentlyDeleteTag, id])

  const handleTagClick = useCallback(
    async (_e) => {
      await switchSubview("cloud", "tag", id)
    },
    [id, switchSubview]
  )

  return (
    <>
      <TagListItemContainer>
        <div className="Tag_LeftSideContainer" onClick={handleTagClick}>
          <div className="Tag_Name" title="View documents with this tag">
            <EditableText {...getRenamingInputProps()}>{name}</EditableText>
          </div>
          {numDocs !== null ? (
            <div className="Tag_Details">{numDocs} Documents</div>
          ) : null}
        </div>
        <div className="Tag_ActionsContainer">
          <div className="Tag_Action" onClick={handleRename} title="Rename">
            <Icon icon="pen" />
          </div>
          <div className="Tag_Action" onClick={handleDelete} title="Delete">
            <Icon icon="trash" />
          </div>
        </div>
      </TagListItemContainer>
    </>
  )
}
