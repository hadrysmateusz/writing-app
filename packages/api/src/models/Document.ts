import mongoose from "mongoose"

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
    default: ""
  },
})

export default mongoose.model("Documents", DocumentSchema)