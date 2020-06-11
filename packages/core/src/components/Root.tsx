import React from "react"

import { DatabaseProvider } from "./Database"
import { ViewStateProvider } from "./ViewStateProvider"
import Main from "./Main"

const Root = () => (
  <DatabaseProvider>
    <ViewStateProvider>
      <Main />
    </ViewStateProvider>
  </DatabaseProvider>
)

export default Root
