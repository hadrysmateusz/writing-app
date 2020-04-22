import React from "react"
import { useAppContext } from "../utils/appContext"
import { Editor, Sidebar } from "@writing-tool/core"
import { ConnectWithMedium } from "@writing-tool/core/src/components/ConnectWithMedium"
import { LogoutButton } from "Components/LogoutButton"
import { Link } from "react-router-dom"
import styled from "styled-components/macro"

const Container = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  width: 100vw;
`

const UnauthContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
`

const EditorPage = () => {
  const { isAuthenticated } = useAppContext()

  return (
    <div>
      {isAuthenticated ? (
        <Container>
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
        </Container>
      ) : (
        <UnauthContainer>
          <div>Log in to use the editor</div>
          <div>
            <Link to="/login">Login</Link>&nbsp;
            <Link to="/signup">Signup</Link>
          </div>
        </UnauthContainer>
      )}
    </div>
  )
}

export default EditorPage
