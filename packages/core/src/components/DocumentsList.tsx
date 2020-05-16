import React, { useState, useEffect } from "react"
import { getDatabase, DocumentDoc } from "../Database"
import { Subscription } from "rxjs"

const DocumentsList = () => {
  const [documents, setDocuments] = useState<DocumentDoc[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let sub: Subscription | undefined

    const subscribeToDocuments = async () => {
      const db = await getDatabase()

      sub = db.documents
        .find({
          selector: {},
          sort: [{ title: "asc" }],
        })
        .$.subscribe((documents) => {
          if (!documents) {
            return
          }
          console.log("reload documents-list ")
          console.dir(documents)
          setDocuments(documents)
          setLoading(false)
        })
    }

    subscribeToDocuments()

    return () => {
      if (!sub) return
      sub.unsubscribe()
    }
  }, [])

  return (
    <div>
      <h3>Documents</h3>
      <ul>
        {loading && <span>Loading...</span>}
        {!loading && documents.length === 0 && <span>No documents</span>}
        {documents.map((document) => (
          <li key={document.title}>{document.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default DocumentsList
