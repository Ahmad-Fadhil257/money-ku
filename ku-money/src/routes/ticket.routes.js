import express from 'express';
import {
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTickets
} from '../controllers/ticket/ticket.controller.js';

// Middleware imports
import { authMiddleware } from '../middlewares/auth/auth.middleware.js';
import { checkTicketLimit } from '../middlewares/checkticketLimit.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';

// DTO imports
import { createTicketDto, updateTicketDto } from '../dto/ticket.dto.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// ⭐ Get all tickets
router.get('/', getTickets);

// Create Ticket (with limit check)
router.post('/', checkTicketLimit, validate(createTicketDto), createTicket);

// Get Ticket by ID
router.get('/:id', getTicketById);

// Update Ticket by ID
router.put('/:id', validate(updateTicketDto), updateTicket);

// Delete Ticket by ID
router.delete('/:id', deleteTicket);

export default router;
