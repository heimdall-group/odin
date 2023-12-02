import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    createdBy: String,
    member: Boolean,
    nickname: String,
    roles: Array,
    super_admin: Boolean,
  },
)
export default mongoose.model("Keys", schema);
