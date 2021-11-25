import markdown from "remark-parse"
import unified from "unified"
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
} from "@udecode/plate"

import slate from "../remark-slate-fork"

// TODO: this can probably be replaced by the plate markdown deserializer
export const deserializeMarkdown = (content: string) => {
  const tree: any = unified()
    .use(markdown)
    .use(slate, {
      nodeTypes: {
        paragraph: ELEMENT_PARAGRAPH,
        block_quote: ELEMENT_BLOCKQUOTE,
        link: ELEMENT_LINK,
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
    })
    .processSync(content)

  return tree.result as Descendant[]
}
