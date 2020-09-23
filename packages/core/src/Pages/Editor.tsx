import React from "react"

import { DatabaseProvider } from "../components/Database"
import { ViewStateProvider } from "../components/View/ViewStateProvider"
import { EditorStateProvider } from "../components/EditorStateProvider"
import { MainProvider } from "../components/MainProvider"
import Main from "../components/Main"
import { ImageModalProvider } from "../components/ImageModal"
import { LinkModalProvider } from "../components/LinkPrompt"
import { UserdataProvider } from "../components/Userdata"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { LocalSettingsProvider } from "../components/LocalSettings"

const EditorPage = () => (
  <DatabaseProvider>
    <LocalSettingsProvider>
      <UserdataProvider>
        <EditorStateProvider>
          <ViewStateProvider>
            <MainProvider>
              <DndProvider backend={HTML5Backend}>
                <ImageModalProvider>
                  <LinkModalProvider>
                    <Main />
                  </LinkModalProvider>
                </ImageModalProvider>
              </DndProvider>
            </MainProvider>
          </ViewStateProvider>
        </EditorStateProvider>
      </UserdataProvider>
    </LocalSettingsProvider>
  </DatabaseProvider>
)

export default EditorPage
