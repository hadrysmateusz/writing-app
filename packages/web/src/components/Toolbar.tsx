export {}

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
