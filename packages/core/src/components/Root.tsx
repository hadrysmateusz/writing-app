import React from "react"

import { DatabaseProvider } from "./Database"
import { ViewStateProvider } from "./ViewStateProvider"
import { EditorStateProvider } from "./EditorStateProvider"
import Main from "./Main"

const Root = () => (
  <DatabaseProvider>
    <EditorStateProvider>
      <ViewStateProvider>
        <Main />
      </ViewStateProvider>
    </EditorStateProvider>
  </DatabaseProvider>
)

export default Root
