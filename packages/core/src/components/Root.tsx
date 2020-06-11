import React from "react"

import { DatabaseProvider } from "./Database"
import { ViewStateProvider } from "./ViewStateProvider"
import { EditorStateProvider } from "./EditorStateProvider"
import Main from "./Main"
import { MainStateProvider } from "./MainStateProvider"

const Root = () => (
  <DatabaseProvider>
    <EditorStateProvider>
      <MainStateProvider>
        <ViewStateProvider>
          <Main />
        </ViewStateProvider>
      </MainStateProvider>
    </EditorStateProvider>
  </DatabaseProvider>
)

export default Root
