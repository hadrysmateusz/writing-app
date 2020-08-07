import React from "react"

import { DatabaseProvider } from "../components/Database"
import { ViewStateProvider } from "../components/View/ViewStateProvider"
import { EditorStateProvider } from "../components/EditorStateProvider"
import { MainProvider } from "../components/MainProvider"
import Main from "../components/Main"
import { ImageModalProvider } from "../components/ImageModal"

const EditorPage = () => (
  <DatabaseProvider>
    <EditorStateProvider>
      <ViewStateProvider>
        <MainProvider>
          <ImageModalProvider>
            <Main />
          </ImageModalProvider>
        </MainProvider>
      </ViewStateProvider>
    </EditorStateProvider>
  </DatabaseProvider>
)

export default EditorPage
