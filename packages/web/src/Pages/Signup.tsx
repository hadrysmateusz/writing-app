import React, { useState, FormEvent } from "react"
import { useHistory } from "react-router-dom"
import { useAppContext } from "../utils/appContext"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmationCode, setConfirmationCode] = useState("")
  const history = useHistory()
  const [newUser, setNewUser] = useState<null | string>(null)
  const { setIsAuthenticated } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    return email.length > 0 && password.length > 0 && password === confirmPassword
  }

  const validateConfirmationForm = () => {
    return confirmationCode.length > 0
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setIsLoading(true)

    setNewUser("test")

    setIsLoading(false)
  }

  const handleConfirmationSubmit = (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
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

  return <div>{newUser === null ? renderForm() : renderConfirmationForm()}</div>
}

export default Signup
