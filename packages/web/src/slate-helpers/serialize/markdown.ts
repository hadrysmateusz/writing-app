// import {
//   BLOCKQUOTE,
//   LINK,
//   HeadingType,
//   PARAGRAPH,
//   CODE_BLOCK,
//   BOLD,
//   ITALIC,
//   CODE_INLINE,
//   STRIKE,
//   HORIZONTAL_RULE,
//   IMAGE,
// } from "./../../slate-plugins"
// import { ListType } from "../../slateTypes"

// import { Node, Editor } from "slate"

export const serializeMarkdown = () => {}
export const parseToMarkdown = () => {}

// export const serializeMarkdown = (editor: Editor) => {
//   return editor.children.map((node) => parseToMarkdown(node)).join("\n")
// }

// // TODO: handle nested (indented) nodes
// export function parseToMarkdown(chunk: Node & { parentType?: string }) {
//   const isElement = chunk.type !== undefined

//   // if the node is a leaf get its text content, otherwise recursively parse child nodes
//   let children = !isElement
//     ? chunk.text
//     : Array.isArray(chunk.children) // TODO: make this check more reliable and more readable
//     ? chunk.children
//         .map((c) => parseToMarkdown({ ...c, parentType: chunk.type }))
//         .join("")
//     : ""

//   // handle void nodes or simply return
//   if (children === "") {
//     switch (chunk.type) {
//       case HORIZONTAL_RULE:
//         return `---\n`
//       case IMAGE:
//         // TODO: add alt text
//         return `[image](${chunk.url})\n`
//       default:
//         return
//     }
//   }

//   // wrap leaf nodes
//   if (chunk[BOLD]) {
//     children = `**${children}**`
//   }
//   if (chunk[ITALIC]) {
//     children = `_${children}_`
//   }
//   if (chunk[STRIKE]) {
//     children = `~~${children}~~`
//   }
//   if (chunk[CODE_INLINE]) {
//     children = `\`${children}\``
//   }

//   // if the node isn't an element there is no need to check for element types
//   if (!isElement) return children

//   // node type (blocks and inlines)
//   switch (chunk.type) {
//     case HeadingType.H1:
//       return `# ${children}\n`
//     case HeadingType.H2:
//       return `## ${children}\n`
//     case HeadingType.H3:
//       return `### ${children}\n`
//     case HeadingType.H4:
//       return `#### ${children}\n`
//     case HeadingType.H5:
//       return `##### ${children}\n`
//     case HeadingType.H6:
//       return `###### ${children}\n`
//     case CODE_BLOCK:
//       // TODO: add the code block type
//       return `\`\`\`\n${children}\n\`\`\`\n`
//     case BLOCKQUOTE:
//       return `> ${children}\n`
//     case LINK:
//       return `[${children}](${chunk.url})`
//     case ListType.LIST_ITEM:
//       // list items dont' have a newline becauase the block node inside it is responsible for adding it
//       return `${chunk.parentType === "numbered_list" ? "1." : "-"} ${children}`
//     case ListType.OL_LIST:
//     case ListType.UL_LIST:
//       return children
//     case PARAGRAPH:
//       return `${children}\n`
//     default:
//       throw new Error(
//         `Markdown Serializer encountered unknown type: ${chunk.type}`
//       )
//   }
// }
