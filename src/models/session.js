import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  maxAge: {
    type: Number,
    required: true,
    trim: true,
  }
})

const Session = mongoose.model("sessions", sessionSchema);

export default Session;