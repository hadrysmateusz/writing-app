import { Transforms, Path, Editor, Element, Range } from "slate"

import { isFirstChild, isLastChild } from "../../../slate-helpers"

export const onKeyDownMoveNode = () => <T extends Editor>(
  e: KeyboardEvent,
  editor: T
) => {
  if (e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key)) {
    e.preventDefault()
    if (!editor.selection || !Range.isCollapsed(editor.selection)) return
    const [, path] = Editor.above(editor, {
      match: (n) => Element.isElement(n) && !editor.isInline(n),
    })

    switch (e.key) {
      case "ArrowUp":
        if (isFirstChild(path)) break
        Transforms.moveNodes(editor, { to: Path.previous(path) })
        break
      case "ArrowDown":
        if (isLastChild(editor, path)) break
        Transforms.moveNodes(editor, { to: Path.next(path) })
        break
    }
  }
}
