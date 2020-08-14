import { useEffect } from "react"
import { cloneDeep } from "lodash"

import { parseToMarkdown } from "./../slate-helpers"

import {
  config,
  addDevToolsEventHandler,
  // removeDevToolsEventHandler,
} from "@writing-tool/core"
import { Editor, Node } from "slate"

export const useLogValue = (value: Node[]) => {
  useEffect(() => {
    if (config.logValue) {
      console.clear()
      console.log("JSON")
      console.log(JSON.stringify(value, null, 2))
      console.log("MARKDOWN")
      console.dir(value.map((node) => parseToMarkdown(node)).join("\n"))
    }
  }, [value])
}

export const useLogEditor = (editor: Editor) => {
  useEffect(() => {
    const logEditor = () => {
      console.dir(cloneDeep(editor))
    }
    addDevToolsEventHandler("logEditor", logEditor)
    // TODO: this is removed temporarily due to some issues
    // return removeDevToolsEventHandler("logEditor", logEditor)
  }, [editor])
}
