import connectToDatabase from "@/lib/mongoose";
import Event from "@/models/Event";

export const getAllEvents = async (req, res) =>{
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
}

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
}
