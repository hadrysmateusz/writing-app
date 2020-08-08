// DEPRECATED

export {}

// import React, { useRef, useEffect } from "react"
// import { ReactEditor, useSlate } from "slate-react"
// import { Editor, Range } from "slate"
// import styled from "styled-components/macro"
// import { Portal } from "react-portal"

// import FormatButton from "./FormatButton"
// import { MARKS } from "@writing-tool/core/src/constants/Slate"
// import { LINK, CODE_INLINE, insertLink } from "../slate-plugins"

// const Div = styled.div`
//   padding: 4px 7px 1px;
//   position: absolute;
//   z-index: 1;
//   top: -10000px;
//   left: -10000px;
//   margin-top: -6px;
//   opacity: 0;
//   color: #9da3a8;
//   background-color: #383838;
//   border: 1px solid #1b1f23;
//   border-radius: 4px;
//   transition: opacity 0.75s;
// `

// const HoveringToolbar = () => {
//   const ref = useRef<HTMLDivElement>(null)
//   const editor = useSlate()

//   useEffect(() => {
//     const el = ref.current
//     const { selection } = editor

//     if (!el) {
//       return
//     }

//     if (
//       !selection ||
//       !ReactEditor.isFocused(editor) ||
//       Range.isCollapsed(selection) ||
//       Editor.string(editor, selection) === ""
//     ) {
//       el.removeAttribute("style")
//       return
//     }

//     const domSelection = window.getSelection()
//     if (domSelection === null) {
//       // TODO: better handle this
//       return
//     }
//     const domRange = domSelection.getRangeAt(0)
//     const rect = domRange.getBoundingClientRect()
//     el.style.opacity = "1"
//     el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
//     el.style.left = `${
//       rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
//     }px`
//   })

//   const onToggleLink = (event: React.MouseEvent) => {
//     event.preventDefault()

//     const url = window.prompt("Enter the URL of the link:") // TODO: replace the prompt
//     if (!url) return
//     insertLink(editor, url)
//   }

//   return (
//     <Portal>
//       <Div ref={ref}>
//         <FormatButton format={MARKS.BOLD} />
//         <FormatButton format={MARKS.ITALIC} />
//         <FormatButton format={MARKS.STRIKE} />
//         <FormatButton format={CODE_INLINE} />
//         <FormatButton format={LINK} onMouseDown={onToggleLink} />
//       </Div>
//     </Portal>
//   )
// }

// export default HoveringToolbar
