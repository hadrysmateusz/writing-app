import styled from "styled-components"
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
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
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LINK,
  ELEMENT_IMAGE,
} from "@udecode/plate"
import { ToolbarCodeBlock } from "@udecode/plate-code-block-ui"

import Icon from "./Icon"
import { ToolbarLink } from "./ToolbarLink"
import { ToolbarImage } from "./ToolbarImage"
import { useLinkModal } from "./LinkPrompt"
import { useImageModal } from "./ImageModal"

const Toolbar = () => {
  const editor = useStoreEditorRef(useEventEditorId("focus"))
  const { open: openLinkModal } = useLinkModal()
  const { open: openImageModal } = useImageModal()

  const getLinkUrl = async (prevUrl: string | null) => {
    const url = await openLinkModal({ prevUrl })
    return typeof url === "string" ? url : null
  }

  const getImageUrl = async () => {
    const url = await openImageModal({})
    return typeof url === "string" ? url : null
  }

  return (
    <ToolbarContainer>
      {/* <button
        onClick={() => {
          console.log(editor)
        }}
      >
        Print Editor
      </button> */}
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H1)}
        icon={<Icon icon={ELEMENT_H1} />}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H2)}
        icon={<Icon icon={ELEMENT_H2} />}
      />
      <ToolbarSpacer small />
      {/* <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H3)}
        icon={"H3"}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H4)}
        icon={"H4"}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H5)}
        icon={"H5"}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H6)}
        icon={"H6"}
      /> */}
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
      <ToolbarList
        type={getPlatePluginType(editor, ELEMENT_UL)}
        icon={<Icon icon={ELEMENT_UL} />}
      />
      <ToolbarList
        type={getPlatePluginType(editor, ELEMENT_OL)}
        icon={<Icon icon={ELEMENT_OL} />}
      />
      <ToolbarSpacer />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<Icon icon={MARK_BOLD} />}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<Icon icon={MARK_ITALIC} />}
      />
      {/* <ToolbarMark
        type={getPlatePluginType(editor, MARK_UNDERLINE)}
        icon={<Icon icon={MARK_UNDERLINE} />}
      /> */}
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_STRIKETHROUGH)}
        icon={<Icon icon={MARK_STRIKETHROUGH} />}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_CODE)}
        icon={<Icon icon={MARK_CODE} />}
      />
      {/* <ToolbarMark
        type={getPlatePluginType(editor, MARK_SUPERSCRIPT)}
        clear={getPlatePluginType(editor, MARK_SUBSCRIPT)}
        icon={<Superscript />}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_SUBSCRIPT)}
        clear={getPlatePluginType(editor, MARK_SUPERSCRIPT)}
        icon={<Subscript />}
      /> */}
      <ToolbarSpacer small />
      <ToolbarLink
        getLinkUrl={getLinkUrl}
        icon={<Icon icon={ELEMENT_LINK} />}
      />
    </ToolbarContainer>
  )
}

const ToolbarSpacer = styled.div<{
  small?: boolean
}>`
  width: ${({ small }) => (small ? "12" : "36")}px;
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

// import React, { useCallback, useMemo } from "react"
// import { useSlateStatic } from "slate-react"
// import styled from "styled-components/macro"

// import {
//   BLOCKQUOTE,
//   CODE_BLOCK,
//   HeadingType,
//   toggleList,
//   insertHorizontalRule,
//   HORIZONTAL_RULE,
//   IMAGE,
// } from "../slate-plugins"
// import { ListType } from "../slateTypes"
// import FormatButton from "./FormatButton"
// import { useImageModal } from "./ImageModal"

// const ToolbarContainer = styled.div`
//   color: "#afb3b6";
// `

// const Section = styled.div`
//   display: inline-block;
//   &:not(:last-child) {
//     margin-right: 20px;
//   }
// `

// export const Toolbar = () => {
//   const editor = useSlateStatic()
//   const { open: openImageModal } = useImageModal()

//   const onInsertHorizontalRule = useCallback(
//     (event: React.MouseEvent) => {
//       event.preventDefault()
//       insertHorizontalRule(editor)
//     },
//     [editor]
//   )

//   const onInsertImage = useCallback(
//     (event: React.MouseEvent) => {
//       event.preventDefault()
//       openImageModal()
//     },
//     [openImageModal]
//   )

//   // TODO: ListType should eventually be replaced by a type without the list item
//   const onToggleList = useCallback(
//     (type: ListType) => (event: React.MouseEvent) => {
//       event.preventDefault()
//       toggleList(editor, type)
//     },
//     [editor]
//   )

//   const onToggleNumberedList = useMemo(() => onToggleList(ListType.OL_LIST), [
//     onToggleList,
//   ])

//   const onToggleBulletedList = useMemo(() => onToggleList(ListType.UL_LIST), [
//     onToggleList,
//   ])

//   return (
//     <>
//       <ToolbarContainer>
//         <Section>
//           <FormatButton format={HeadingType.H1} />
//           <FormatButton format={HeadingType.H2} />
//         </Section>

//         <Section>
//           <FormatButton format={BLOCKQUOTE} />
//           <FormatButton format={CODE_BLOCK} />
//           <FormatButton format={IMAGE} onMouseDown={onInsertImage} />
//         </Section>

//         <Section>
//           <FormatButton
//             format={ListType.OL_LIST}
//             onMouseDown={onToggleNumberedList}
//           />
//           <FormatButton
//             format={ListType.UL_LIST}
//             onMouseDown={onToggleBulletedList}
//           />
//         </Section>

//         <Section>
//           <FormatButton
//             text="hr"
//             format={HORIZONTAL_RULE}
//             onMouseDown={onInsertHorizontalRule}
//           />
//         </Section>

//         <Section>
//           <FormatButton format={ELEMENTS.EMBED} text="Embed" />
//         </Section>
//       </ToolbarContainer>
//     </>
//   )
// }
