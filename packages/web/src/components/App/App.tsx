// import React, { useEffect } from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import styled from "styled-components/macro"
import { Amplify } from "aws-amplify"

import {
  MediumAuthRedirectPage,
  LoginPage,
  EditorPage,
  SignupPage,
} from "../../Pages"

import { AuthContextProvider, AuthenticatedRoute } from "../Auth"
import GlobalStyles from "../GlobalStyles"

// window.LOG_LEVEL = "DEBUG"

Amplify.configure({
  Auth: {
    identityPoolId: "us-east-1:b43ad165-df33-434c-a243-d204feb25d31",
    region: "us-east-1",
    userPoolId: "us-east-1_U9vIjaJBz",
    userPoolWebClientId: "n2cs9p5s667sck722q74nieq9",
    mandatorySignIn: true,
  },
})

export const App = () => {
  // This effect catches all uncaught contextmenu events and prevents the display of the default context menu
  // TODO: make sure all basic context menu actions have a custom alternative (especially text-related in the editor like cutting and pasting )
  // useEffect(() => {
  //   const listener = (event: MouseEvent) => {
  //     event.preventDefault()
  //     console.warn(
  //       `Prevented a contextmenu event. Consider creating a custom one for this element. This warning was triggered on the following element:`
  //     )
  //     console.dir(event.target)
  //   }

  //   document.addEventListener("contextmenu", listener)

  //   return () => {
  //     document.removeEventListener("contextmenu", listener)
  //   }
  // })

  // TODO: figure out why production desktop build always goes to "page not found" by default

  return (
    <>
      <GlobalStyles />

      <AuthContextProvider>
        <AppContainer>
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

              <AuthenticatedRoute path="/" exact>
                <EditorPage />
              </AuthenticatedRoute>

              <Route>
                <h2>Page not found!</h2>

                <Link to="/login">Login</Link>

                <Link to="/signup">Signup</Link>
              </Route>
            </Switch>
          </Router>
        </AppContainer>
      </AuthContextProvider>
    </>
  )
}

const AppContainer = styled.div`
  min-width: 0;
  min-height: 0;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
`
