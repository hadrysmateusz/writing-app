import React from "react"
import styled from "styled-components"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { Editor } from "@writing-tool/core"

import { MediumAuthRedirectPage, LoginPage } from "Pages"

const App = () => (
  <Router>
    <Container>
      <Switch>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route path="/medium-auth-callback">
          <MediumAuthRedirectPage />
        </Route>
        <Route path="/" exact>
          <Editor />
        </Route>
        <Route>
          <h2>Page not found!</h2>
        </Route>
      </Switch>
    </Container>
  </Router>
)

const Container = styled.div`
  margin: 40px auto;
  padding: 20px;
  max-width: 540px;
  font-size: 20px;
  box-sizing: content-box;
`

export default App
