import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    website_trigger: String, // Website action that invoces this
    bot_trigger: String, // Bot action that invoces this
    event: String, // What endpoint does when invoced
    endpoint: String, // Url to endpoint
    reponse_title: String,
    response: String, // What can be expected in response
    parameters_title: String,
    parameters: String, // Parameters needed
    version: Number, // Api version
  },
)
export default mongoose.model("Documentation", schema);
