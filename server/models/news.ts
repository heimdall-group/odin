import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: String,
    author: String,
    body: String,
    date: Date,
    internal: Boolean,
    external: Boolean,
  },
)
export default mongoose.model("News", schema);
