import React, { useState, FormEvent } from "react"
import { Auth } from "aws-amplify"
import { Link, Redirect } from "react-router-dom"

import { useAuthContext } from "@writing-tool/core"

const Login = () => {
  const { setIsAuthenticated, isAuthenticated } = useAuthContext()
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

  return isAuthenticated ? (
    <Redirect to="/" />
  ) : (
    <div style={{ padding: "0 20px" }}>
      <h2>Log in to use the editor</h2>
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
        <button
          type="submit"
          disabled={!validate()}
          style={{ margin: "20px 0" }}
        >
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
