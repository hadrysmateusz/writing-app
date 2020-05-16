import React, { useState } from "react"
import { getDatabase } from "../Database"

const DocumentAdd = () => {
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")

  const addDocument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const db = await getDatabase()
    db.documents.insert({ title, content })
    setContent("")
    setTitle("")
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }
  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value)
  }

  return (
    <div>
      <h3>Add Document</h3>
      <form onSubmit={addDocument}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={handleContentChange}
        />
        <button type="submit">Insert a Document</button>
      </form>
    </div>
  )
}

export default DocumentAdd
