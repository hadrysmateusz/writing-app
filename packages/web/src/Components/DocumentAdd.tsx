import React, { Component } from "react"
import { getDatabase } from "../Database"

class DocumentAdd extends Component {
  state = {
    title: "",
    content: "",
  }
  subs = []

  addHero = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { title, content } = this.state
    const db = await getDatabase()
    db.documents.insert({ title, content })
    this.setState({ title: "", content: "" })
  }
  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: event.target.value })
  }
  handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ content: event.target.value })
  }

  render() {
    return (
      <div id="insert-box" className="box">
        <h3>Add Document</h3>
        <form onSubmit={this.addHero}>
          <input
            type="text"
            placeholder="Name"
            value={this.state.title}
            onChange={this.handleTitleChange}
          />
          <input
            type="text"
            placeholder="Content"
            value={this.state.content}
            onChange={this.handleContentChange}
          />
          <button type="submit">Insert a Document</button>
        </form>
      </div>
    )
  }
}

export default DocumentAdd
