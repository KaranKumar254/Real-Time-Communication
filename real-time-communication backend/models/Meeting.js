const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema(
  {
    meetingId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // minutes
      required: true,
    },
    createdBy: {
      type: String, // username
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", MeetingSchema);
