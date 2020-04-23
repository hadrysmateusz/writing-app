import React, { useState } from "react"
import { useAsyncEffect } from "../../hooks"
import { API } from "aws-amplify"

export const Sidebar: React.FC = ({ children }) => {
  // TODO: replace any type with the proper document object interface
  const [documents, setDocuments] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useAsyncEffect(async () => {
    // TODO: handle unauthenticated calls

    try {
      // TODO: check if an error is thrown instead of returned when the status of response is 4xx or 5xx
      const { data, error } = await API.get("documents", "/documents", undefined)
      if (error) {
        setError(error)
        return
      }

      setDocuments(data)
      console.log(data)
    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }, [])

  return (
    <div>
      <div>{children}</div>
      <div>{error ?? documents.map((doc) => <div>{doc.title}</div>)}</div>
    </div>
  )
}
