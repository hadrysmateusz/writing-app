import React from "react"
import { DatabaseProvider } from "./Database"
import Main from "./Main"

const Root = () => (
  <DatabaseProvider>
    <Main />
  </DatabaseProvider>
)

export default Root
