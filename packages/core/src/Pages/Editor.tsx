import React from "react"

import { DatabaseProvider } from "../components/Database"
import { ViewStateProvider } from "../components/View/ViewStateProvider"
import { EditorStateProvider } from "../components/EditorStateProvider"
import { MainStateProvider } from "../components/MainState/MainStateProvider"
import { APIProvider } from "../components/APIProvider"
import Main from "../components/Main"

const EditorPage = () => (
  <DatabaseProvider>
    <EditorStateProvider>
      <ViewStateProvider>
        <APIProvider>
          <MainStateProvider>
            <Main />
          </MainStateProvider>
        </APIProvider>
      </ViewStateProvider>
    </EditorStateProvider>
  </DatabaseProvider>
)

export default EditorPage
