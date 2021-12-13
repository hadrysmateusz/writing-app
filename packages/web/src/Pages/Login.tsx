import React, { useState, FormEvent } from "react"
import { Link, Redirect } from "react-router-dom"
import styled from "styled-components"

import { useAuthContext } from "../components/Auth"
import { Button } from "../components/Button"
import { TextInput } from "../components/TextInput"

const Login = () => {
  const { login, isAuthenticated } = useAuthContext()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const validate = () => {
    return email.length > 0 && password.length > 0
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    login(email, password)
  }

  return isAuthenticated ? (
    <Redirect to="/" />
  ) : (
    <AuthOuterContainer>
      <AuthInnerContainer>
        <h2>Log in to use the editor</h2>
        <form onSubmit={handleSubmit}>
          <AuthSection>
            <label>
              <LabelText>Email</LabelText>
              <TextInput
                placeholder="john.doe@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </AuthSection>
          <AuthSection>
            <label>
              <LabelText>Password</LabelText>
              <TextInput
                placeholder="********"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </AuthSection>
          <Button
            type="submit"
            disabled={!validate()}
            style={{ margin: "20px 0" }}
            variant="primary"
          >
            Login
          </Button>
        </form>
        <div>
          or <Link to="/signup">Signup</Link>
        </div>
      </AuthInnerContainer>
    </AuthOuterContainer>
  )
}

export const AuthOuterContainer = styled.div`
  min-width: 0;
  min-height: 0;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
`

export const AuthInnerContainer = styled.div`
  width: 310px;

  padding: 10px 20px 20px;
  background: var(--dark-300);
  border: 1px solid var(--dark-500);
  border-radius: 3px;

  box-shadow: 0 4px 20px 6px rgba(0, 0, 0, 0.2);

  font-size: 13px;
  color: var(--light-400);

  h2 {
    margin-bottom: 26px;
    color: var(--light-600);
    font-family: "Poppins";
    letter-spacing: 0.35px;
    line-height: 1.5;
  }

  a {
    color: var(--light-600);
    &:focus {
      color: white;
      outline: 1px dashed rgba(255, 255, 255, 0.66);
      font-weight: bold;
    }
    user-select: none;
  }
`

export const AuthSection = styled.div`
  margin-bottom: 18px;
  /* > label {

    display: grid;
    align-items: baseline;
    grid-template-columns: 120px 1fr;
    gap: 10px;
  } */
`

export const LabelText = styled.div`
  margin-bottom: 7px;
  font-weight: bold;
`

export default Login
