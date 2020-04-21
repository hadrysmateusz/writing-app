import React, { useState, useEffect } from "react"
import { Auth } from "aws-amplify"
import styled from "styled-components"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

import { MediumAuthRedirectPage, LoginPage, EditorPage } from "Pages"
import { AppContextProvider } from "../utils/appContext"
import { LogoutButton } from "./LogoutButton"

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(true)

  useEffect(() => {
    onLoad()
  }, [])

  const onLoad = async () => {
    try {
      await Auth.currentSession()
      setIsAuthenticated(true)
    } catch (error) {
      if (error !== "No current user") {
        alert(error)
      }
    }
    setIsAuthenticating(false)
  }

  return isAuthenticating ? null : (
    <AppContextProvider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        {isAuthenticated ? <LogoutButton /> : <Link to="/login">Login</Link>}
        <Container>
          <Switch>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route path="/medium-auth-callback">
              <MediumAuthRedirectPage />
            </Route>
            <Route path="/" exact>
              <EditorPage />
            </Route>
            <Route>
              <h2>Page not found!</h2>
            </Route>
          </Switch>
        </Container>
      </Router>
    </AppContextProvider>
  )
}

const Container = styled.div`
  margin: 40px auto;
  padding: 20px;
  max-width: 540px;
  font-size: 20px;
  box-sizing: content-box;
`
