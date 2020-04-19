import React, { useState, FormEvent } from "react"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const validate = () => {
    return email.length > 0 && password.length > 0
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
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
