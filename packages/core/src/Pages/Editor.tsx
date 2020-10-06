import React from "react"

import { DatabaseProvider } from "../components/Database"
import { ViewStateProvider } from "../components/View/ViewStateProvider"
// import { EditorStateProvider } from "../components/EditorStateProvider"
import { MainProvider } from "../components/MainProvider"
import Main from "../components/Main"
import { UserdataProvider } from "../components/Userdata"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { LocalSettingsProvider } from "../components/LocalSettings"

const EditorPage = () => (
  <DatabaseProvider>
    <LocalSettingsProvider>
      <UserdataProvider>
        <ViewStateProvider>
          <MainProvider>
            <DndProvider backend={HTML5Backend}>
              <Main />
            </DndProvider>
          </MainProvider>
        </ViewStateProvider>
      </UserdataProvider>
    </LocalSettingsProvider>
  </DatabaseProvider>
)

export default EditorPage
