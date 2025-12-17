import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    createdBy: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    file: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["submitted", "reviewing", "processed", "completed"],
      default: "submitted",
      trim: true,
    },
  },
  { timestamps: true }
);

// Index untuk mempercepat pencarian
ticketSchema.index({ "createdBy._id": 1 });

const Ticket = mongoose.model("Ticket", ticketSchema, "Tickets");

export default Ticket;
