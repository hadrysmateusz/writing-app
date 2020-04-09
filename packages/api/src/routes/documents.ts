import express, { Request, Response } from "express"
import { Document } from "../models"

const router = express.Router()

// LIST: get all documents
router.get("/", async (req: Request, res: Response) => {
  try {
    // TODO: only return documents by the currently authenticated user
    // TODO: only return basic data like the title to save bandwidth (this is for listing purposes, a separate query route can be added later)
    const documents = await Document.find()
    res.json({ data: documents })
  } catch (err) {
    res.json({ error: err })
  }
})

// DETAILS: get specific documents by id
router.get("/:id", (req: Request, res: Response) => {
  try {
    const document = Document.findById(req.params.id)
    res.json({ data: document })
  } catch (err) {
    res.json({ error: err })
  }
})

// CREATE: create a new document
router.post("/", async (req: Request, res: Response) => {
  const document = new Document({
    title: req.body.title,
    body: req.body.body,
  })

  try {
    const savedDocument = await document.save()
    res.json({ data: savedDocument })
  } catch (err) {
    res.json({ error: err })
  }
})

// UPDATE: updates a specific document with values from the request body
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const updatedDocument = await Document.updateOne(
      { _id: req.params.id },
      {
        $set: req.body,
      }
    )
    res.json({ data: updatedDocument })
  } catch (err) {
    res.json({ error: err })
  }
})

// DELETE: deletes a specific document permanently
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const removedDocument = await Document.remove({ _id: req.params.id })
    res.json({ data: removedDocument })
  } catch (err) {
    res.json({ error: err })
  }
})

export default router
