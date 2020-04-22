import React from "react"
import { useAppContext } from "../utils/appContext"
import { Editor, Sidebar } from "@writing-tool/core"
import { ConnectWithMedium } from "@writing-tool/core/src/components/ConnectWithMedium"
import { LogoutButton } from "Components/LogoutButton"
import { Link } from "react-router-dom"

const EditorPage = () => {
  const { isAuthenticated } = useAppContext()

  return (
    <div>
      <div>
        {isAuthenticated ? (
          <div>
            <Sidebar>
              {isAuthenticated ? (
                <LogoutButton />
              ) : (
                <>
                  <Link to="/login">Login</Link>&nbsp;
                  <Link to="/signup">Signup</Link>
                </>
              )}
              <ConnectWithMedium />
            </Sidebar>
            <Editor />
          </div>
        ) : (
          <div>Log in to use the editor</div>
        )}
      </div>
    </div>
  )
}

export default EditorPage
