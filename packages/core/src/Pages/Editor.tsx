import React from "react"

import { DatabaseProvider } from "../components/Database"
import { ViewStateProvider } from "../components/View/ViewStateProvider"
import { EditorStateProvider } from "../components/EditorStateProvider"
import { MainStateProvider } from "../components/MainState/MainStateProvider"
import { DocumentsAPIProvider } from "../components/DocumentsAPI"
import { GroupsAPIProvider } from "../components/Groups/GroupsProvider"
import Main from "../components/Main"

const EditorPage = () => (
  <DatabaseProvider>
    <EditorStateProvider>
      <DocumentsAPIProvider>
        <GroupsAPIProvider>
          <MainStateProvider>
            <ViewStateProvider>
              <Main />
            </ViewStateProvider>
          </MainStateProvider>
        </GroupsAPIProvider>
      </DocumentsAPIProvider>
    </EditorStateProvider>
  </DatabaseProvider>
)

export default EditorPage
