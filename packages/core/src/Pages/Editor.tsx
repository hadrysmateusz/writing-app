import React from "react"

import { DatabaseProvider } from "../components/Database"
import { ViewStateProvider } from "../components/View/ViewStateProvider"
import { EditorStateProvider } from "../components/EditorStateProvider"
import { MainProvider } from "../components/MainProvider"
import Main from "../components/Main"

const EditorPage = () => (
  <DatabaseProvider>
    <EditorStateProvider>
      <ViewStateProvider>
        <MainProvider>
          <Main />
        </MainProvider>
      </ViewStateProvider>
    </EditorStateProvider>
  </DatabaseProvider>
)

export default EditorPage
