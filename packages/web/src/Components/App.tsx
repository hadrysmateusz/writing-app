import React, { useState, useEffect } from "react"
import { Auth } from "aws-amplify"
import styled from "styled-components"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

import { MediumAuthRedirectPage, LoginPage, EditorPage, SignupPage } from "Pages"
import { AppContextProvider } from "../utils/appContext"

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
        <Switch>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/signup">
            <SignupPage />
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
      </Router>
    </AppContextProvider>
  )
}
