import {
  BLOCKQUOTE,
  ListType,
  LINK,
  HeadingType,
  PARAGRAPH,
  CODE_BLOCK,
  BOLD,
  ITALIC,
  CODE_INLINE,
  STRIKE
} from "./../../slate-plugins"
import { Node } from "slate"

export function parseToMarkdown(chunk: Node & { parentType?: string }) {
  const isElement = chunk.type !== undefined

  let children = !isElement
    ? chunk.text
    : chunk.children
        .map((c) => parseToMarkdown({ ...c, parentType: chunk.type }))
        .join("")

  if (children === "") return

  // marks
  if (chunk[BOLD]) {
    children = `**${children}**`
  }
  if (chunk[ITALIC]) {
    children = `_${children}_`
  }
  if (chunk[STRIKE]) {
    children = `~~${children}~~`
  }
  if (chunk[CODE_INLINE]) {
    children = `\`${children}\``
  }

  if (!isElement) return children

  // node type
  switch (chunk.type) {
    case HeadingType.H1:
      return `# ${children}\n`
    case HeadingType.H2:
      return `## ${children}\n`
    case HeadingType.H3:
      return `### ${children}\n`
    case HeadingType.H4:
      return `#### ${children}\n`
    case HeadingType.H5:
      return `##### ${children}\n`
    case HeadingType.H6:
      return `###### ${children}\n`
    case CODE_BLOCK:
      // TODO: add the code block type
      return `\`\`\`\n${children}\n\`\`\`\n`
    case BLOCKQUOTE:
      return `> ${children}\n`
    case LINK:
      return `[${children}](${chunk.url})`
    case ListType.LIST_ITEM:
      // list items dont' have a newline becauase the block node inside it is responsible for adding it
      return `${chunk.parentType === "numbered_list" ? "1." : "-"} ${children}`
    case ListType.OL_LIST:
    case ListType.UL_LIST:
      return children
    case PARAGRAPH:
      return `${children}\n`
    default:
      console.log(`Markdown Serializer encountered unknown type: ${chunk.type}`)
      return children
  }
}
