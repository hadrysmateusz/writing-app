import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import Main from "../components/Main"
import { DatabaseProvider } from "../components/Database"
import { ViewStateProvider } from "../components/ViewState"
import { UserdataProvider } from "../components/Userdata"
import { LocalSettingsProvider } from "../components/LocalSettings"
import { LocalFSProvider } from "../components/LocalFSProvider"
import { TabsProvider } from "../components/TabsProvider"
import { TagsProvider } from "../components/TagsProvider"
import { DocumentsAPIProvider } from "../components/DocumentsAPIProvider"
import { CloudGroupsProvider } from "../components/CloudGroupsProvider"

const EditorPage = () => (
  <DatabaseProvider>
    <LocalSettingsProvider>
      <UserdataProvider>
        <ViewStateProvider>
          <TabsProvider>
            <TagsProvider>
              <DocumentsAPIProvider>
                <CloudGroupsProvider>
                  <DndProvider backend={HTML5Backend}>
                    <LocalFSProvider>
                      <Main />
                    </LocalFSProvider>
                  </DndProvider>
                </CloudGroupsProvider>
              </DocumentsAPIProvider>
            </TagsProvider>
          </TabsProvider>
        </ViewStateProvider>
      </UserdataProvider>
    </LocalSettingsProvider>
  </DatabaseProvider>
)

export default EditorPage
