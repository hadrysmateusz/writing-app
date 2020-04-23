import React, { useState, FormEvent } from "react"
import { useHistory, Link } from "react-router-dom"
import { Auth } from "aws-amplify"

import { useAppContext } from "@writing-tool/core"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmationCode, setConfirmationCode] = useState("")
  const history = useHistory()
  const [newUser, setNewUser] = useState<any>(null)
  const { setIsAuthenticated } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    return email.length > 0 && password.length > 0 && password === confirmPassword
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
      setIsAuthenticated(true)
      history.push("/")
    } catch (error) {
      // TODO: better error handling
      alert("error")
      console.error(error)
      setIsLoading(false)
    }
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </label>
      </div>
      <div>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          <span>Confirm Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
      </div>
      <button type="submit" disabled={!validateForm()}>
        Login
      </button>
    </form>
  )

  const renderConfirmationForm = () => (
    <form onSubmit={handleConfirmationSubmit}>
      <div>Please check your email for the code.</div>
      <div>
        <label>
          <span>Confirmation Code</span>
          <input
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            autoFocus
          />
        </label>
      </div>

      <button type="submit" disabled={!validateConfirmationForm()}>
        Verify
      </button>
    </form>
  )

  return (
    <div>
      <div>Create an account to get started</div>
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
    </div>
  )
}

export default Signup
