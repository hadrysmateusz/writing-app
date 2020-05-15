import React, { Component } from "react"
import { getDatabase, DocumentDoc } from "../Database"
import { Subscription } from "rxjs"

class DocumentsList extends Component {
  state: {
    documents: DocumentDoc[]
    loading: boolean
  } = {
    documents: [],
    loading: true,
  }
  subs: Subscription[] = []

  async componentDidMount() {
    const db = await getDatabase()

    const sub = db.documents
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
        this.setState({ documents, loading: false })
      })

    this.subs.push(sub)
  }

  componentWillUnmount() {
    this.subs.forEach((sub) => sub.unsubscribe())
  }

  deleteDocument = async (document: DocumentDoc) => {
    console.log("delete document:")
    console.dir(document)
  }

  editDocument = async (document: DocumentDoc) => {
    console.log("edit document:")
    console.dir(document)
  }

  renderActions = () => {
    // TODO
    // return (
    //     <div className="actions">
    //         <i className="fa fa-pencil-square-o" aria-hidden="true" onClick={() => this.editHero(hero)}></i>
    //         <i className="fa fa-trash-o" aria-hidden="true" onClick={() => this.deleteHero(hero)}></i>
    //     </div>
    // )
    return null
  }

  render() {
    const { documents, loading } = this.state
    return (
      <div>
        <h3>Documents</h3>
        <ul>
          {loading && <span>Loading...</span>}
          {!loading && documents.length === 0 && <span>No documents</span>}
          {documents.map((document) => {
            return (
              <li key={document.title}>
                <span className="name">{document.title}</span>
                {this.renderActions()}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default DocumentsList
