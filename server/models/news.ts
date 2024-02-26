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
    summary: String,
    title: String,
    mentions: Array,
    message_ids: {
      cover: String,
      body: String,
    },
  },
)
export default mongoose.model("News", schema);
