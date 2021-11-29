import remarkParse from "remark-parse"
import { unified } from "unified"
import { Descendant } from "slate"
import {
  ELEMENT_PARAGRAPH,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_LINK,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LI,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_CODE_BLOCK,
  MARK_CODE,
  MARK_ITALIC,
  MARK_BOLD,
  MARK_STRIKETHROUGH,
  ELEMENT_IMAGE,
  ELEMENT_HR,
} from "@udecode/plate"
import remarkGfm from "remark-gfm"

import slate, { serialize } from "../remark-slate-fork"

export const slateUnifiedConfig = {
  nodeTypes: {
    image: ELEMENT_IMAGE,
    thematic_break: ELEMENT_HR,

    paragraph: ELEMENT_PARAGRAPH,
    block_quote: ELEMENT_BLOCKQUOTE,
    code_block: ELEMENT_CODE_BLOCK,
    link: ELEMENT_LINK,
    inline_code_mark: MARK_CODE,
    emphasis_mark: MARK_ITALIC,
    strong_mark: MARK_BOLD,
    delete_mark: MARK_STRIKETHROUGH,
    ul_list: ELEMENT_UL,
    ol_list: ELEMENT_OL,
    listItem: ELEMENT_LI,
    heading: {
      1: ELEMENT_H1,
      2: ELEMENT_H2,
      3: ELEMENT_H3,
      4: ELEMENT_H4,
      5: ELEMENT_H5,
      6: ELEMENT_H6,
    },
  },
  linkDestinationKey: "url",
  imageSourceKey: "url",
  imageCaptionKey: "caption",
  ignoreParagraphNewline: true, // this is to prevent image elements from being serialized as BREAK_TAG paragraphs (TODO: it probably has other side-effects that I don't understand yet and might need a custom solution instead of using this option)
}

// TODO: bold links don't get deserialized properly (links wrapped in other marks probably don't work either)
// ^ they are deserialized as a leaf node of this shape: {bold: true, text: '', and url: 'THE_LINK_URL'}
export const myDeserializeMd = (data: string) => {
  console.log("using myDeserializeMd")
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm) // included for strikethrough support but it also adds support for other things that might lead to unpredictable behavior TODO: figure out what to do with this fact TODO: combining italics, bold AND strikethrough still doesn't get deserialized properly (only when it has no surrounding whitespace though)
    .use(slate, slateUnifiedConfig)
    .processSync(data)
  return tree.result as Descendant[]
}

export const mySerializeMd = (nodes: Descendant[]) => {
  console.log("using mySerializeMd")
  const serializedContent = nodes
    .map((v) => serialize(v, slateUnifiedConfig))
    .join("")
  return serializedContent
}
