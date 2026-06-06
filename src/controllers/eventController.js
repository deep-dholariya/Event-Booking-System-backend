const Event = require("../models/Event");

// Create Event (Admin Only)
const createEvent = async (req, res) => {
  try {
    const { name, date, capacity } = req.body;

    if (!name || !date || !capacity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const event = await Event.create({
      name,
      date,
      capacity,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Events (User + Admin)
const getEvents = async (req, res) => {
  try {
    const {
      start,
      end,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Date Range Filter
    if (start || end) {
      filter.date = {};

      if (start) {
        filter.date.$gte = new Date(start);
      }

      if (end) {
        filter.date.$lte = new Date(end);
      }
    }

    const skip = (page - 1) * limit;

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .skip(skip)
      .limit(Number(limit));

    const totalEvents =
      await Event.countDocuments(filter);

    res.status(200).json({
      success: true,
      totalEvents,
      currentPage: Number(page),
      totalPages: Math.ceil(
        totalEvents / Number(limit)
      ),
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Event (Admin Only)
const updateEvent = async (req, res) => {
  try {
    const { name, date, capacity } = req.body;

    const event = await Event.findById(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    event.name = name || event.name;
    event.date = date || event.date;
    event.capacity =
      capacity || event.capacity;

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Event (Admin Only)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};