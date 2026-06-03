import { body } from 'express-validator';

export const createMessageValidator = [
  body('body')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 500 })
    .withMessage('Message must be 500 characters or less'),
];
