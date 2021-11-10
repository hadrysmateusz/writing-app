import styled from "styled-components"
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LINK,
  ELEMENT_IMAGE,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  getPlatePluginType,
  useStoreEditorRef,
  useEventEditorId,
  ToolbarElement,
  ToolbarMark,
  ToolbarList,
} from "@udecode/plate"
import { ToolbarCodeBlock } from "@udecode/plate-code-block-ui"

import { useImageModal } from "../ImageModal"
import { useLinkModal } from "../LinkPrompt"
import Icon from "../Icon"

import { ToolbarLink } from "./ToolbarLink"
import { ToolbarImage } from "./ToolbarImage"

export const Toolbar = () => {
  const editor = useStoreEditorRef(useEventEditorId("focus"))
  const { getLinkUrl } = useLinkModal()
  const { getImageUrl } = useImageModal()

  return (
    <ToolbarContainer>
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<Icon icon={MARK_BOLD} />}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<Icon icon={MARK_ITALIC} />}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_STRIKETHROUGH)}
        icon={<Icon icon={MARK_STRIKETHROUGH} />}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_CODE)}
        icon={<Icon icon={MARK_CODE} />}
      />
      <ToolbarLink
        getLinkUrl={getLinkUrl}
        icon={<Icon icon={ELEMENT_LINK} />}
      />

      <ToolbarSpacer small />

      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H1)}
        icon={<Icon icon={ELEMENT_H1} />}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H2)}
        icon={<Icon icon={ELEMENT_H2} />}
      />

      <ToolbarSpacer small />

      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<Icon icon={ELEMENT_BLOCKQUOTE} />}
      />
      <ToolbarCodeBlock
        type={getPlatePluginType(editor, ELEMENT_CODE_BLOCK)}
        icon={<Icon icon={ELEMENT_CODE_BLOCK} />}
      />
      <ToolbarImage
        icon={<Icon icon={ELEMENT_IMAGE} />}
        getImageUrl={getImageUrl}
      />

      <ToolbarSpacer small />

      {/* TODO: fix toggling lists */}
      <ToolbarList
        type={getPlatePluginType(editor, ELEMENT_UL)}
        icon={<Icon icon={ELEMENT_UL} />}
      />
      <ToolbarList
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
  color: #545454;
  margin: 10px -4px 20px;

  .slate-ToolbarButton:hover {
    color: #7d7d7d;
  }
  .slate-ToolbarButton-active,
  .slate-ToolbarButton-active:hover {
    color: #eee;
  }
`

export default Toolbar
