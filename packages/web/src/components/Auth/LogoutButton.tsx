import React from "react"
import { useHistory } from "react-router-dom"

import { useAuthContext } from "./Auth"

import { Button } from "../Button"

export const LogoutButton: React.FC<{
  onBeforeLogout?: () => void
  onAfterLogout?: () => void
}> = ({ onBeforeLogout, onAfterLogout }) => {
  const history = useHistory()
  const { logout } = useAuthContext()

  const handleLogout = async () => {
    onBeforeLogout && onBeforeLogout()

    const success = logout()

    if (success) {
      onAfterLogout && onAfterLogout() // TODO: consider supporting a hook after a failed logout
      history.push("/")
    }
  }

  // TODO: add some special styling and maybe a confirmation modal
  return <Button onClick={handleLogout}>Logout</Button>
}
