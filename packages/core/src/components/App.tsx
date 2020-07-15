import React, { useState, useEffect } from "react"
import { Auth } from "aws-amplify"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"

import { useAsyncEffect } from "../hooks"
import { AuthContextProvider } from "./Auth"
import GlobalStyles from "./GlobalStyles"

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

  // This effect catches all uncaught contextmenu events and prevents the display of the default context menu
  // TODO: make sure all basic context menu actions have a custom alternative (especially text-related in the editor like cutting and pasting )
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      event.preventDefault()
      console.warn(
        `Prevented a contextmenu event. Consider creating a custom one for this element. This warning was triggered on the following element:`
      )
      console.dir(event.target)
    }

    document.addEventListener("contextmenu", listener)

    return () => {
      document.removeEventListener("contextmenu", listener)
    }
  })

  // TODO: create AuthenticatedRoute and UnauthenticatedRoute components to simplify routing
  return (
    <>
      <GlobalStyles />

      {isAuthenticating ? null : (
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
      )}
    </>
  )
}
