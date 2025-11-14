import { body } from 'express-validator';

export const createRsvpValidator = [
  body('eventId').notEmpty().withMessage('eventId is required').isString(),
  body('status')
    .notEmpty()
    .withMessage('status is required')
    .isIn(['attending', 'not attending', 'maybe'])
    .withMessage('status must be attending, not attending, or maybe'),
];

export const updateRsvpValidator = [
  body('status')
    .notEmpty()
    .withMessage('status is required')
    .isIn(['attending', 'not attending', 'maybe'])
    .withMessage('status must be attending, not attending, or maybe'),
];
