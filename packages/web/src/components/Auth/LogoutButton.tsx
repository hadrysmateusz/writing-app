import React from "react"
import { useHistory } from "react-router-dom"

import { useAuthContext } from "./Auth"

import { Button } from "../Button"
import { useDatabase } from "../Database"

export const LogoutButton: React.FC<{
  onBeforeLogout?: () => void
  onAfterLogout?: () => void
}> = ({ onBeforeLogout, onAfterLogout }) => {
  const history = useHistory()
  const { logout } = useAuthContext()
  const db = useDatabase()

  const handleLogout = async () => {
    onBeforeLogout && onBeforeLogout()

    const success = await logout()

    if (success === true) {
      onAfterLogout && onAfterLogout() // TODO: consider supporting a hook after a failed logout
      // TODO: check if this is necessary and how to do it properly
      db.destroy().then(() => {
        history.push("/")
      })
    }
  }

  // TODO: add some special styling and maybe a confirmation modal
  return (
    <Button variant="danger" onClick={handleLogout}>
      Logout
    </Button>
  )
}
