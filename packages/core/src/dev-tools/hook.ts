import { useEffect } from "react"
import { cloneDeep } from "lodash"
import { Editor, Node } from "slate"

import { parseToMarkdown } from "../slate-helpers"
import { addDevToolsEventHandler } from "./Lib"
import { config } from "./config"

export const useDevUtils = ({
  value,
  editor,
}: {
  value: Node[]
  editor: Editor
}) => {
  useEffect(() => {
    if (config.logValue) {
      console.clear()
      console.log("JSON")
      console.log(JSON.stringify(value, null, 2))
      console.log("MARKDOWN")
      console.dir(value.map((node) => parseToMarkdown(node)).join("\n"))
    }
  }, [value])

  useEffect(() => {
    const logEditor = () => {
      console.dir(cloneDeep(editor))
    }
    // TODO: this is potentially a memory leak (fix the handler remover)
    addDevToolsEventHandler("logEditor", logEditor)
    // TODO: this is removed temporarily due to some issues
    // return removeDevToolsEventHandler("logEditor", logEditor)
  }, [editor])
}

export const useLogEditor = (editor: Editor) => {}
