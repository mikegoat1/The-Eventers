import {
  getEventById,
  updateEvent,
  deleteEvent,
} from "@/controllers/eventController";

export default function handlerID({ query: { id } }, res) {
  try {
    if (req.method === "GET") {
      return getEventById(req, res, id);
    } else if (req.method === "PUT") {
      return updateEvent(req, res, id);
    } else if (req.method === "DELETE") {
      return deleteEvent(req, res, id);
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
