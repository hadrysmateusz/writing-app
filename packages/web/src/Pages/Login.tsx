import React, { useState, FormEvent } from "react"
import { Auth } from "aws-amplify"
import { useHistory, Link } from "react-router-dom"

import { useAppContext } from "@writing-tool/core"

const Login = () => {
  const { setIsAuthenticated } = useAppContext()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const history = useHistory()

  const validate = () => {
    return email.length > 0 && password.length > 0
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      await Auth.signIn(email, password)
      setIsAuthenticated(true)
      history.push("/")
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div>
      <div>Log in to use the editor</div>
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
      <div>
        or <Link to="/signup">Signup</Link>
      </div>
    </div>
  )
}

export default Login
