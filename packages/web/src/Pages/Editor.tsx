import React from "react"
import { useAppContext } from "../utils/appContext"
import { Editor } from "@writing-tool/core"

const EditorPage = () => {
  const { isAuthenticated } = useAppContext()

  return (
    <div>
      <div>{isAuthenticated ? <Editor /> : <div>Log in to use the editor</div>}</div>
    </div>
  )
}

export default EditorPage