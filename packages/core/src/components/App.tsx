import React, { useState } from "react"
import { Auth } from "aws-amplify"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"

import { useAsyncEffect } from "../hooks"
import { AuthContextProvider } from "./Auth"

import {
  MediumAuthRedirectPage,
  LoginPage,
  EditorPage,
  SignupPage,
} from "../Pages"

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(true)

  useAsyncEffect(async () => {
    try {
      await Auth.currentSession()
      setIsAuthenticated(true)
    } catch (error) {
      if (error !== "No current user") {
        alert(error)
      }
    }
    setIsAuthenticating(false)
  }, [])

  return isAuthenticating ? null : (
    <AuthContextProvider value={{ isAuthenticated, setIsAuthenticated }}>
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
            {isAuthenticated ? <EditorPage /> : <Redirect to="/login" />}
          </Route>
          <Route>
            <h2>Page not found!</h2>
          </Route>
        </Switch>
      </Router>
    </AuthContextProvider>
  )
}
