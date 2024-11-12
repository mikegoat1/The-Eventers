import connectToDatabase from "../lib/mongoose";
import { Event } from "../models/index";

export const getAllEvents = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    await connectToDatabase();
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEventById = async (req, res, id) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    await connectToDatabase();
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateEvent = async (req, res, id) => {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const { name, date, location, description, attendees } = req.body;
  try {
    await connectToDatabase();
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.name = name;
    event.description = description;
    event.date = date;
    event.location = location;
    event.attendees = attendees;
    await event.save();
    res.status(200).json({ message: "Event updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createEvent = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const { name, date, location, description, attendees } = req.body;

  try {
    await connectToDatabase();
    const event = new Event({ name, date, location, description, attendees });
    await event.save();
    res.status(200).json({ message: "Event created" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEvent = async (req, res, id) => {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    await connectToDatabase();
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await event.deleteOne();
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
