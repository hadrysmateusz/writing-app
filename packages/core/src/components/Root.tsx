import React from "react"

import { DatabaseProvider } from "./Database"
import { ViewStateProvider } from "./View/ViewStateProvider"
import { EditorStateProvider } from "./EditorStateProvider"
import Main from "./Main"
import { MainStateProvider } from "./MainState/MainStateProvider"
import { DocumentsAPIProvider } from "./DocumentsAPI"
import { GroupsAPIProvider } from "./Groups/GroupsProvider"

const Root = () => (
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

export default Root
