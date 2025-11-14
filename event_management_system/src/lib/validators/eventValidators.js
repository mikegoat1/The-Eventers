import { body } from 'express-validator';

export const createEventValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Event name is required'),
  body('date')
    .notEmpty()
    .withMessage('Event date is required')
    .isISO8601()
    .withMessage('Event date must be a valid ISO 8601 date'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 3 })
    .withMessage('Location must be at least 3 characters'),
  body('description')
    .optional()
    .isLength({ max: 600 })
    .withMessage('Description can be up to 600 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Music', 'Sports', 'Education', 'Health', 'Technology', 'Other'])
    .withMessage('Invalid category provided'),
  body('attendees')
    .optional()
    .isArray()
    .withMessage('Attendees must be an array'),
  body('attendees.*')
    .optional()
    .isString()
    .withMessage('Each attendee id must be a string'),
];

export const updateEventValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Event name cannot be empty'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Event date must be a valid ISO 8601 date'),
  body('location')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Location must be at least 3 characters'),
  body('description')
    .optional()
    .isLength({ max: 600 })
    .withMessage('Description can be up to 600 characters'),
  body('category')
    .optional()
    .trim()
    .isIn(['Music', 'Sports', 'Education', 'Health', 'Technology', 'Other'])
    .withMessage('Invalid category provided'),
  body('attendees')
    .optional()
    .isArray()
    .withMessage('Attendees must be an array'),
  body('attendees.*')
    .optional()
    .isString()
    .withMessage('Each attendee id must be a string'),
];
