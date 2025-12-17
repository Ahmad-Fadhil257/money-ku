import Joi from 'joi';

/**
 * DTO for creating ticket
 */
export const createTicketDto = Joi.object({
  subject: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(100)
    .messages({
      'string.base': 'Subject must be a string',
      'string.empty': 'Subject is required',
      'string.min': 'Subject must be at least 3 characters',
      'string.max': 'Subject must not exceed 100 characters',
      'any.required': 'Subject is required',
    }),

  message: Joi.string()
    .required()
    .trim()
    .min(5)
    .messages({
      'string.base': 'Message must be a string',
      'string.empty': 'Message is required',
      'string.min': 'Message must be at least 5 characters',
      'any.required': 'Message is required',
    }),

  file: Joi.string()
    .optional()
    .allow('')
    .trim()
    .messages({
      'string.base': 'File must be a string',
    }),
});

/**
 * DTO for updating ticket
 */
export const updateTicketDto = Joi.object({
  subject: Joi.string()
    .optional()
    .trim()
    .min(3)
    .max(100)
    .messages({
      'string.base': 'Subject must be a string',
      'string.min': 'Subject must be at least 3 characters',
      'string.max': 'Subject must not exceed 100 characters',
    }),

  message: Joi.string()
    .optional()
    .trim()
    .min(5)
    .messages({
      'string.base': 'Message must be a string',
      'string.min': 'Message must be at least 5 characters',
    }),

  file: Joi.string()
    .optional()
    .allow('')
    .trim()
    .messages({
      'string.base': 'File must be a string',
    }),

  status: Joi.string()
    .valid('submitted', 'in_progress', 'resolved', 'closed')
    .optional()
    .messages({
      'string.base': 'Status must be a string',
      'any.only':
        'Status must be one of: submitted, in_progress, resolved, closed',
    }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });
