import { validationResult } from 'express-validator';

export const runValidation = async (validators, req, res) => {
  for (const validator of validators) {
    const result = await validator.run(req);
    if (!result.isEmpty()) {
      break;
    }
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
};
