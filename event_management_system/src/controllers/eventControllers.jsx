import connectToDatabase from "@/lib/mongoose";
import Event from "@/models/Event";

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
  const { title, description, date } = req.body;
  try {
    await connectToDatabase();
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.title = title;
    event.description = description;
    event.date = date;
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
  const { title, description, date } = req.body;

  try {
    await connectToDatabase();
    const event = new Event({ title, description, date });
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
        await event.remove();
        res.status(200).json({ message: "Event deleted" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};