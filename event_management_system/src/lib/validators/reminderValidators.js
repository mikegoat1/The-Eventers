import { body } from 'express-validator';

export const reminderValidator = [
  body('remindAt')
    .notEmpty()
    .withMessage('remindAt is required')
    .isISO8601()
    .withMessage('remindAt must be a valid ISO 8601 date'),
  body('method')
    .optional()
    .isIn(['notification', 'email'])
    .withMessage('method must be either notification or email'),
];
