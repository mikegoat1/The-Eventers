import  { getEventById, updateEvent, deleteEvent } from '../../../controllers/eventController';

export default function handlerID( req, res) {
    const { id } = req.id;
    if( req.method === 'GET') {
        // You didn't set this up yet, ref controller. Keep in mind Mikey.
        return getEventById(req, res, id);
    }
    else if( req.method === 'PUT') {
        return updateEvent(req, res, id);
    }
    else if( req.method === 'DELETE') {
        return deleteEvent(req, res, id);
    }
    else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
}