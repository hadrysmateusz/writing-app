import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components/macro"

import {
  Editor,
  Sidebar,
  useAppContext,
  LogoutButton,
  ConnectWithMedium,
} from "@writing-tool/core"

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
    <Container>
      <Sidebar>
        <LogoutButton />
        <ConnectWithMedium />
      </Sidebar>
      <Editor />
    </Container>
  )
}

export default EditorPage
