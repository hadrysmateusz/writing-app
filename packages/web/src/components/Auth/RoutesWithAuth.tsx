import React from "react"
import { Route, Redirect, RouteProps } from "react-router-dom"

import { useAuthContext } from "./Auth"
import { CurrentUserProvider } from "./CurrentUserContext"

/**
 * Route that can only be accessed while authenticated
 *
 * Redirects to login page otherwise
 */
export const AuthenticatedRoute: React.FC<RouteProps> = ({
  children,
  ...routeProps
}) => {
  const { isAuthenticated } = useAuthContext()

  return (
    <Route {...routeProps}>
      {/* isAuthenticated and isCurrent user should never be checked at the same time because the app can get stuck in a redirect loop */}
      {isAuthenticated ? (
        <CurrentUserProvider>{children}</CurrentUserProvider>
      ) : (
        <Redirect to="/login" />
      )}
    </Route>
  )
}

/**
 * Route that can only be accessed while unauthenticated
 *
 * Redirects to root page otherwise
 */
export const UnauthenticatedRoute: React.FC<RouteProps> = ({
  children,
  ...routeProps
}) => {
  const { isAuthenticated } = useAuthContext()

  return (
    <Route {...routeProps}>
      {!isAuthenticated ? children : <Redirect to="/" />}
    </Route>
  )
}
