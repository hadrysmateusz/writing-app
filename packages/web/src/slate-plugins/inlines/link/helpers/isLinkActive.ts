import { Editor } from "slate"

import { LINK } from "../types"

export const isLinkActive = (editor: Editor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) => ("type" in n ? n.type === LINK : false),
  })

  return !!link
}
