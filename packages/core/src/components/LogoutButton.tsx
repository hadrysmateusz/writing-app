import React from "react"
import { Auth } from "aws-amplify"
import { useHistory } from "react-router-dom"

import { useAuthContext } from "./Auth"

export const LogoutButton = () => {
  const history = useHistory()
  const { setIsAuthenticated } = useAuthContext()

  const handleLogout = async () => {
    await Auth.signOut()
    setIsAuthenticated(false)
    history.push("/")
  }

  return <button onClick={() => handleLogout()}>Logout</button>
}
