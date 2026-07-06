const Joi = require('joi');

const makeCollegePaymentsSchema = Joi.object({
  email: Joi.string()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.empty': 'Email is required',
    }),
  matricNumber: Joi.string().length(8).required().messages({
    'string.empty': 'Matric number is required',
    'string.length': 'Matric number must be exactly 8 characters long',
  }),
  amount: Joi.number().required().positive().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be a positive number',
    'number.empty': 'Amount is required',
  }),
  fullname: Joi.string().required().messages({
    'string.empty': 'Full name is required',
  }),
  collegeName: Joi.string().optional().messages({
    'string.empty': 'College name is required',
  }),
  department: Joi.string().optional().messages({
    'string.empty': 'Department is required',
  }),
  level: Joi.string().optional().messages({
    'string.empty': 'Level is required',
  }),
  fresherLevel: Joi.string().optional().messages({
    'string.empty': 'Fresher level is required',
  }),
  mainLevel: Joi.string().optional().messages({
    'string.empty': 'Main level is required',
  }),
});

const initiatePaymentSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.empty': 'Email is required',
    }),
  payerName: Joi.string().required().messages({
    'string.empty': 'Payer name is required',
  }),
  amount: Joi.number().required().positive().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be a positive number',
    'number.empty': 'Amount is required',
  }),
  partnerIdentifier: Joi.string().uppercase().required().messages({
    'string.empty': 'Partner identifier is required',
  }),
  businessVertical: Joi.string().optional(),
  metadata: Joi.object().optional(),
  callbackUrl: Joi.string().uri().optional(),
  chargeType: Joi.string().valid('total', 'base').default('total'),
});

module.exports = { makeCollegePaymentsSchema, initiatePaymentSchema };