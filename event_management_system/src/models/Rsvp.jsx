import mongoose from "mongoose";

const rsvpSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["attending", "not attending", "maybe"],
    required: true,
  },
});

const Rsvp = mongoose.models.Rsvp || mongoose.model("Rsvp", rsvpSchema);

export default Rsvp;
