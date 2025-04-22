import { body, ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation rules for creating a SWIFT code
export const swiftCodeValidationRules: ValidationChain[] = [
  body('swiftCode')
    .isString()
    .matches(/^[A-Z0-9]{8}([A-Z0-9]{3})?$/) //8 or 11 chars, all caps, no spaces
    .withMessage('SWIFT code must be 8 or 11 alphanumeric characters (uppercase)'),
  body('bankName').isString().notEmpty().withMessage('Bank name is required'),
  body('address').isString().notEmpty().withMessage('Address is required'),
  body('countryISO2')
    .isString()
    .isLength({ min: 2, max: 2 })
    .matches(/^[A-Z]{2}$/) // only 2 uppercase letters
    .withMessage('Country ISO2 code must be exactly 2 characters (uppercase)'),
  body('countryName').isString().notEmpty().withMessage('Country name is required'),
  body('isHeadquarter')
    .isBoolean()
    .withMessage('isHeadquarter must be a boolean'),
];

// Middleware
export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
}