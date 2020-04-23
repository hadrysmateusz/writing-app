import React, { useState, useEffect } from "react"
import { Auth } from "aws-amplify"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { MediumAuthRedirectPage, LoginPage, EditorPage, SignupPage } from "Pages"
import { AppContextProvider } from "../utils/appContext"

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  // contains the documentId of the currently active document
  const [currentDocument, setCurrentDocument] = useState<string | null>(null)

  useEffect(() => {
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

    onLoad()
  }, [])

  return isAuthenticating ? null : (
    <AppContextProvider
      value={{ isAuthenticated, setIsAuthenticated, currentDocument, setCurrentDocument }}
    >
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
