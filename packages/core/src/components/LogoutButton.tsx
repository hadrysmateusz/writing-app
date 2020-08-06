import React from "react"
import { Auth } from "aws-amplify"
import { useHistory } from "react-router-dom"

import { useAuthContext } from "./Auth"

export const LogoutButton: React.FC<{
  onBeforeLogout?: () => void
  onAfterLogout?: () => void
}> = ({ onBeforeLogout, onAfterLogout }) => {
  const history = useHistory()
  const { setIsAuthenticated } = useAuthContext()

  const handleLogout = async () => {
    onBeforeLogout && onBeforeLogout()

    await Auth.signOut()
    setIsAuthenticated(false)

    onAfterLogout && onAfterLogout()

    history.push("/")
  }

  return <button onClick={() => handleLogout()}>Logout</button>
}
