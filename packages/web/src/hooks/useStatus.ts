import { useState } from "react"

// TODO: figure out to provide types for possible states
const useStatus = (initialState: string) => {
  const [status, setStatus] = useState(initialState)

  const Status = (props: { [key: string]: React.ReactElement }) => {
    return props[status] || null
  }

  return { Status, setStatus }
}

export default useStatus
