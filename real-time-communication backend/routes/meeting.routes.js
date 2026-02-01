const express = require("express");
const router = express.Router();
const {
  createMeeting,
  getMeetings,
  deleteMeeting,
} = require("../controllers/meeting.controller");
router.delete("/:meetingId", deleteMeeting);

router.post("/create", createMeeting);
router.get("/", getMeetings);

module.exports = router;
