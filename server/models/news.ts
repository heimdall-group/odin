import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    author: String,
    body: String,
    cover: {
      type: String,
      required: true,
    },
    date: Date,
    external: Boolean,
    internal: Boolean,
    title: String,
  },
)
export default mongoose.model("News", schema);
