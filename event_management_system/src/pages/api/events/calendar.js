import { getAllEvents } from '../../../controllers/eventControllers';

export default function calendarEventsHandler(req, res) {
  return getAllEvents(req, res);
}
