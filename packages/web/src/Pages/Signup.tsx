import React, { useState, FormEvent } from "react"
import { Link, Redirect } from "react-router-dom"
import { Auth } from "aws-amplify"

import { useAuthContext } from "../components/Auth"
import { TextInput } from "../components/TextInput"
import { Button } from "../components/Button"
import {
  AuthInnerContainer,
  AuthOuterContainer,
  AuthSection,
  LabelText,
} from "./Login"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmationCode, setConfirmationCode] = useState("")
  const [newUser, setNewUser] = useState<any>(null)
  const { isAuthenticated } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    return (
      email.length > 0 && password.length > 0 && password === confirmPassword
    )
  }

  const validateConfirmationForm = () => {
    return confirmationCode.length > 0
  }

  /*
    TODO: A quick note on the signup flow here. If the user refreshes their page at the confirm step, they won’t be able to get back and confirm that account. It forces them to create a new account instead. We are keeping things intentionally simple but here are a couple of hints on how to fix it.

    Check for the UsernameExistsException in the handleSubmit function’s catch block.

    Use the Auth.resendSignUp() method to resend the code if the user has not been previously confirmed. Here is a link to the Amplify API docs. https://aws-amplify.github.io/amplify-js/api/classes/authclass.html

    Confirm the code just as we did before.
  */

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setIsLoading(true)

    try {
      const newUser = await Auth.signUp({
        username: email,
        password: password,
      })
      setNewUser(newUser)
    } catch (error) {
      // TODO: better error handling
      alert("error")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmationSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      await Auth.confirmSignUp(email, confirmationCode)
      await Auth.signIn(email, password)
      console.warn(
        "setIsAuthenticated is note exposed. Fix that. (See Signup.tsx)"
      )
      // setIsAuthenticated(true) // TODO: this is not exposed from useAuthContext
    } catch (error) {
      // TODO: better error handling
      alert("error")
      console.error(error)
      setIsLoading(false)
    }
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <AuthSection>
        <label>
          <LabelText>Email</LabelText>
          <TextInput
            placeholder="john.doe@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
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
      <AuthSection>
        <label>
          <LabelText>Confirm Password</LabelText>
          <TextInput
            placeholder="********"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
      </AuthSection>
      <Button
        variant="primary"
        type="submit"
        disabled={!validateForm()}
        style={{ margin: "20px 0" }}
      >
        Signup
      </Button>
    </form>
  )

  const renderConfirmationForm = () => (
    <form onSubmit={handleConfirmationSubmit}>
      <div>Please check your email for the code.</div>
      <div>
        <AuthSection>
          <LabelText>Confirmation Code</LabelText>
          <TextInput
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            autoFocus
          />
        </AuthSection>
      </div>

      <Button
        variant="primary"
        type="submit"
        disabled={!validateConfirmationForm()}
        style={{ margin: "20px 0" }}
      >
        Verify
      </Button>
    </form>
  )

  return isAuthenticated ? (
    <Redirect to="/" />
  ) : (
    <AuthOuterContainer>
      <AuthInnerContainer>
        <h2>Create an account to get started</h2>
        <div>
          {isLoading
            ? "Please wait"
            : newUser === null
            ? renderForm()
            : renderConfirmationForm()}
        </div>
        <div>
          or <Link to="/login">Login</Link>&nbsp;
        </div>
      </AuthInnerContainer>
    </AuthOuterContainer>
  )
}

export default Signup
