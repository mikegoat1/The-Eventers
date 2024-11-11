import { getAllEvents, createEvent } from "../../../controllers/eventControllers";

const allowedMethods = ["GET", "POST"];

export const eventHandler = (req, res) => {
  if (req.method === "GET") {
    return getAllEvents(req, res);
  } else if (req.method === "POST") {
    return createEvent(req, res);
  } else {
    res.setHeader("Allow", allowedMethods);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
