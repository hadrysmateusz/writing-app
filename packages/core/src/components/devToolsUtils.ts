import { useEffect } from "react"
import { cloneDeep } from "lodash"
import pretty from "pretty"

import { parseToMarkdown, serializeHTML } from "./../slate-helpers"

import {
  config,
  addDevToolsEventHandler,
  // removeDevToolsEventHandler,
} from "@writing-tool/core"
import { useSlate } from "slate-react"
import { Editor } from "slate"

export const useLogValue = (value: Node[]) => {
  const editor = useSlate()
  useEffect(() => {
    if (config.logValue) {
      console.clear()
      console.log("JSON")
      console.log(JSON.stringify(value, null, 2))
      console.log("MARKDOWN")
      console.dir(value.map((node) => parseToMarkdown(node)).join("\n"))
      console.log("HTML")
      console.log(pretty(serializeHTML(editor)))
    }
  }, [editor, value])
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
