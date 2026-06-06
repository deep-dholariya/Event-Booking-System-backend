const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// Public
router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin Only
router.post("/", auth, admin, createEvent);
router.put("/:id", auth, admin, updateEvent);
router.delete("/:id", auth, admin, deleteEvent);

module.exports = router;