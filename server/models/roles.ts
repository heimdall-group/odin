import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name:	String,
    id: String,
    permissions: {
      type: Object,
      default: {
        read: false,
        write: false,
      },
      set(value: {[key: string]: {read: boolean, write: boolean}}) {
        const obj: {[key: string]: {read: boolean, write: boolean}} = {}
        for (const key in value) {
          obj[key] = {
            read: value[key].read ? true : false,
            write: value[key].write ? true : false,
          }
        }
        return obj
      }
    },
    color:	String,
    hoist:	Boolean,
    unicode_emoji:	String,
    position:	Number,
    flags: String,
  },
)
export default mongoose.model("Roles", schema);
