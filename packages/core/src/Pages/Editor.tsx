import React from "react"

import { DatabaseProvider } from "../components/Database"
import { ViewStateProvider } from "../components/View/ViewStateProvider"
import { EditorStateProvider } from "../components/EditorStateProvider"
import { MainProvider } from "../components/MainProvider"
import Main from "../components/Main"
import { ImageModalProvider } from "../components/ImageModal"
import { LinkModalProvider } from "../components/LinkPrompt"
import { UserdataProvider } from "../components/Userdata"

const EditorPage = () => (
  <DatabaseProvider>
    <UserdataProvider>
      <EditorStateProvider>
        <ViewStateProvider>
          <MainProvider>
            <ImageModalProvider>
              <LinkModalProvider>
                <Main />
              </LinkModalProvider>
            </ImageModalProvider>
          </MainProvider>
        </ViewStateProvider>
      </EditorStateProvider>
    </UserdataProvider>
  </DatabaseProvider>
)

export default EditorPage
