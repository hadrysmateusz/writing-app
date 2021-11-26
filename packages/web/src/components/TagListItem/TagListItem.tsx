import styled from "styled-components/macro"

import Icon from "../Icon"
import { useTagsAPI } from "../MainProvider/context"
import { EditableText, useEditableText } from "../RenamingInput"
// import { getPromptModalContent, usePromptModal } from "../PromptModal"
// import { formatOptional } from "../../utils"

// const TagEditModalContent = getPromptModalContent("Tag name", "Save")

export const TagListItem: React.FC<{ id: string; name: string }> = ({
  id,
  name,
}) => {
  const { actuallyPermanentlyDeleteTag, renameTag } = useTagsAPI()

  const { startRenaming, getProps: getRenamingInputProps } = useEditableText(
    name,
    (value: string) => {
      renameTag(id, value)
    }
  )

  const handleRename = () => {
    // closeMenu()
    startRenaming()
  }

  // const { Modal: EditModal, ...toggleableProps } = usePromptModal(name)
  // const handleRename = async (_e) => {
  //   // TODO: check for duplicates (maybe enforce on schema level)
  //   const newName = await toggleableProps.open({ initialValue: name })

  //   if (newName?.trim()) {
  //     renameTag(id, newName)
  //   }
  // }

  return (
    <>
      <TagContainer>
        <div className="Tag_Name">
          <EditableText {...getRenamingInputProps()}>{name}</EditableText>
        </div>
        <div className="Tag_ActionsContainer">
          <div className="Tag_Action" onClick={handleRename}>
            <Icon icon="pen" />
          </div>
          <div
            className="Tag_Action"
            onClick={(_e) => {
              // TODO: replace with a confirmation dialog
              actuallyPermanentlyDeleteTag(id)
            }}
          >
            <Icon icon="trash" />
          </div>
        </div>
      </TagContainer>
      {/* <EditModal component={TagEditModalContent} /> */}
    </>
  )
}

const TagContainer = styled.div`
  display: flex;

  padding: 8px 14px;
  font-size: 12px;

  .Tag_Name {
    color: var(--light-500);
    font-weight: 500;
    font-family: "Poppins";
    user-select: none;
  }

  .Tag_ActionsContainer {
    opacity: 0;
    transition: opacity 200ms ease-out;

    display: flex;
    gap: 10px;
    color: var(--light-200);
    margin-left: auto;
  }

  .Tag_Action {
    cursor: pointer;

    :hover {
      color: var(--light-400);
    }
  }

  &:hover {
    .Tag_ActionsContainer {
      opacity: 1;
    }
  }
`
