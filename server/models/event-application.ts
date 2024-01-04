import mongoose from "mongoose";


const schema = new mongoose.Schema({
  applicant: String,
  role: mongoose.Types.ObjectId,
  group: mongoose.Types.ObjectId,
  event: mongoose.Types.ObjectId,
  type: String,
  date: Date,
});
export default mongoose.model("Events-Applications", schema);
