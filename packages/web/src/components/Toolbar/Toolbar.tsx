import styled from "styled-components"
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_IMAGE,
  // ELEMENT_LINK,
  // MARK_BOLD,
  // MARK_CODE,
  // MARK_ITALIC,
  // MARK_STRIKETHROUGH,
  getPlatePluginType,
  usePlateEditorRef,
  usePlateEventId,
  // MarkToolbarButton,
  BlockToolbarButton,
  CodeBlockToolbarButton,
  ListToolbarButton,
} from "@udecode/plate"

import { useImageModal } from "../ImageModal"
// import { useLinkModal } from "../LinkPrompt"
import Icon from "../Icon"

// import { ToolbarLink } from "./ToolbarLink"
import { ToolbarImage } from "./ToolbarImage"

export const Toolbar = () => {
  const editor = usePlateEditorRef(usePlateEventId("focus"))
  // const { getLinkUrl } = useLinkModal()
  const { getImageUrl } = useImageModal()

  return (
    <ToolbarContainer>
      {/* <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<Icon icon={MARK_BOLD} />}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<Icon icon={MARK_ITALIC} />}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_STRIKETHROUGH)}
        icon={<Icon icon={MARK_STRIKETHROUGH} />}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_CODE)}
        icon={<Icon icon={MARK_CODE} />}
      />
      <ToolbarLink
        getLinkUrl={getLinkUrl}
        icon={<Icon icon={ELEMENT_LINK} />}
      />

      <ToolbarSpacer small /> */}

      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_H1)}
        icon={<Icon icon={ELEMENT_H1} />}
      />
      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_H2)}
        icon={<Icon icon={ELEMENT_H2} />}
      />

      <ToolbarSpacer small />

      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<Icon icon={ELEMENT_BLOCKQUOTE} />}
      />
      <CodeBlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_CODE_BLOCK)}
        icon={<Icon icon={ELEMENT_CODE_BLOCK} />}
      />
      <ToolbarImage
        icon={<Icon icon={ELEMENT_IMAGE} />}
        getImageUrl={getImageUrl}
      />

      <ToolbarSpacer small />

      {/* TODO: fix toggling lists */}
      <ListToolbarButton
        type={getPlatePluginType(editor, ELEMENT_UL)}
        icon={<Icon icon={ELEMENT_UL} />}
      />
      <ListToolbarButton
        type={getPlatePluginType(editor, ELEMENT_OL)}
        icon={<Icon icon={ELEMENT_OL} />}
      />
    </ToolbarContainer>
  )
}

const ToolbarSpacer = styled.div<{
  small?: boolean
}>`
  width: ${({ small }) => (small ? "18" : "36")}px;
`

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  user-select: none;
  flex-wrap: wrap;
  color: var(--dark-600);
  margin: 10px -4px 20px;

  .slate-ToolbarButton:hover {
    color: var(--light-100);
  }
  .slate-ToolbarButton-active,
  .slate-ToolbarButton-active:hover {
    color: var(--light-500);
  }
`

export default Toolbar
