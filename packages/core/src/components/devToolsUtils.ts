import { useEffect } from "react"
import { cloneDeep } from "lodash"

import { parseToMarkdown } from "./../slate-helpers"

import {
  config,
  addDevToolsEventHandler,
  removeDevToolsEventHandler
} from "@writing-tool/core"

export const useLogValue = (value) => {
  useEffect(() => {
    if (config.logValue) {
      console.clear()
      console.log("JSON")
      console.log(JSON.stringify(value, null, 2))
      console.log("MARKDOWN")
      console.dir(value.map((node) => parseToMarkdown(node)).join("\n"))
      console.log(`Top level nodes: ${value.length}`)
    }
  }, [value])
}

export const useLogEditor = (editor) => {
  useEffect(() => {
    const logEditor = () => {
      console.dir(cloneDeep(editor))
    }
    addDevToolsEventHandler("logEditor", logEditor)
    // TODO: this is removed temporarily due to some issues
    // return removeDevToolsEventHandler("logEditor", logEditor)
  }, [editor])
}