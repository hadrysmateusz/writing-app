import Icon from "../Icon"
import { useTagsAPI } from "../MainProvider/context"
import { EditableText, useEditableText } from "../RenamingInput"
import { usePrimarySidebar } from "../ViewState"

import { TagListItemContainer } from "./TagListItem.styles"

export const TagListItem: React.FC<{ id: string; name: string }> = ({
  id,
  name,
}) => {
  const { actuallyPermanentlyDeleteTag, renameTag } = useTagsAPI()
  const { switchSubview } = usePrimarySidebar()

  const { startRenaming, getProps: getRenamingInputProps } = useEditableText(
    name,
    (value: string) => {
      renameTag(id, value)
    }
  )

  const handleRename = (_e) => {
    startRenaming()
  }

  const handleDelete = (_e) => {
    // TODO: replace with a confirmation dialog
    actuallyPermanentlyDeleteTag(id)
  }

  const handleTagClick = (_e) => {
    switchSubview("cloud", "tag", id)
  }

  return (
    <>
      <TagListItemContainer>
        <div
          className="Tag_Name"
          onClick={handleTagClick}
          title="View documents with this tag"
        >
          <EditableText {...getRenamingInputProps()}>{name}</EditableText>
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
