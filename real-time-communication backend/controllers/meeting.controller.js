const Meeting = require("../models/Meeting");
const { v4: uuidv4 } = require("uuid");

// CREATE MEETING
exports.createMeeting = async (req, res) => {
  try {
    const { title, dateTime, duration, createdBy } = req.body;

    if (!createdBy) {
      return res.status(400).json({ error: "Creator missing" });
    }

    const meeting = await Meeting.create({
      meetingId: uuidv4().slice(0, 8),
      title,
      dateTime,
      duration,
      createdBy,
    });

    res.json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Meeting creation failed" });
  }
};

// DELETE MEETING (ONLY CREATOR)
exports.deleteMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username missing" });
    }

    const meeting = await Meeting.findOne({ meetingId });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    // 🔐 CASE-INSENSITIVE CHECK
    if (
      meeting.createdBy.toLowerCase() !==
      username.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ error: "Not allowed to delete" });
    }

    await Meeting.deleteOne({ meetingId });
    res.json({ message: "Meeting deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete meeting" });
  }
};

// GET ALL MEETINGS
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ dateTime: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
};
