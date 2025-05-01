import mongoose from "mongoose";
const DocumentSchema = new mongoose.Schema(
  {
    _id: {
      type: String, 
    },
    title: {
      type: String,
    },
    data: {
      type: Object,
      default: { ops: [{ insert: "" }] },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        permission: {
          type: String,
          default: "view",
        },
      },
    ],
    requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
      },
    ],
  },
  {
    _id:true,
    timestamps: true,
  }
);

export const DocumentModel = mongoose.model("Document", DocumentSchema);
