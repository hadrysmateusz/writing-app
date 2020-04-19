import React, { useState, FormEvent } from "react"
import { Auth } from "aws-amplify"
import { useAppContext } from "../utils/appContext"

const Login = () => {
  const { setIsAuthenticated } = useAppContext()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const validate = () => {
    return email.length > 0 && password.length > 0
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      await Auth.signIn(email, password)
      setIsAuthenticated(true)
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit" disabled={!validate()}>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
