import mongoose from "mongoose";

const roles = new mongoose.Schema({
  uid: String,
  name: String,
  application: Boolean,
  order: Number,
  id: mongoose.Schema.Types.ObjectId,
})
const assignee = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  order: Number,
  roles: [roles],
  type: String,
})

const schema = new mongoose.Schema({
  status: String,
  assignees: [assignee],
  author: String,
  date: Date,
  desc: String,
  external: Boolean,
  interested: [],
  max_assignes: Number,
  recurring: String,
  title: String,
  type: String,
  guild_scheduled_event_id: String,
});
export default mongoose.model("Events", schema);
