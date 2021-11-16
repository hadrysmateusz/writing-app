import markdown from "remark-parse"
import slate from "../remark-slate-fork"
import unified from "unified"
import {
  ELEMENT_PARAGRAPH,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_LINK,
  ELEMENT_UL_LIST,
  ELEMENT_OL_LIST,
  ELEMENT_LIST_ITEM,
  ELEMENT_HEADING_3,
  ELEMENT_HEADING_2,
  ELEMENT_HEADING_1,
  ELEMENT_HEADING_4,
  ELEMENT_HEADING_5,
  ELEMENT_HEADING_6,
} from "../../slateTypes"
import { Descendant } from "slate"

export const deserializeMarkdown = (content: string) => {
  const tree: any = unified()
    .use(markdown)
    .use(slate, {
      nodeTypes: {
        paragraph: ELEMENT_PARAGRAPH,
        block_quote: ELEMENT_BLOCKQUOTE,
        link: ELEMENT_LINK,
        ul_list: ELEMENT_UL_LIST,
        ol_list: ELEMENT_OL_LIST,
        listItem: ELEMENT_LIST_ITEM,
        heading: {
          1: ELEMENT_HEADING_1,
          2: ELEMENT_HEADING_2,
          3: ELEMENT_HEADING_3,
          4: ELEMENT_HEADING_4,
          5: ELEMENT_HEADING_5,
          6: ELEMENT_HEADING_6,
        },
      },
    })
    .processSync(content)

  return tree.result as Descendant[]
}
