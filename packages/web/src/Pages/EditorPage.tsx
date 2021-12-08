import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import Main from "../components/Main"
import { DatabaseProvider } from "../components/Database"
import { ViewStateProvider } from "../components/ViewState"
import { MainProvider } from "../components/MainProvider"
import { UserdataProvider } from "../components/Userdata"
import { LocalSettingsProvider } from "../components/LocalSettings"
import { LocalFSProvider } from "../components/LocalFSProvider"

const EditorPage = () => (
  <DatabaseProvider>
    <LocalSettingsProvider>
      <UserdataProvider>
        <ViewStateProvider>
          <MainProvider>
            <DndProvider backend={HTML5Backend}>
              <LocalFSProvider>
                <Main />
              </LocalFSProvider>
            </DndProvider>
          </MainProvider>
        </ViewStateProvider>
      </UserdataProvider>
    </LocalSettingsProvider>
  </DatabaseProvider>
)

export default EditorPage
