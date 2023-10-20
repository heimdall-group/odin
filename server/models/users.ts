import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    uid: {
      type: String, 
      unique: true,
    },
    roles: Array,
    pending: Boolean,
    member: Boolean,
    nickname: String,
    joined_at: String,
    super_admin: Boolean,
    avatar: String,
  },
)
export default mongoose.model("Users", schema);
