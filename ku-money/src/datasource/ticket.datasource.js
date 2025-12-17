import Ticket from '../models/Ticket.model.js';

/**
 * Create new ticket
 */
export const createTicket = async (ticketData) => {
  return Ticket.create(ticketData);
};

/**
 * Find ticket by ID
 */
export const findTicketById = async (ticketId) => {
  return Ticket.findById(ticketId);
};

/**
 * Find ticket by ID and user ID
 */
export const findTicketByIdAndUserId = async (ticketId, userId) => {
  return Ticket.findOne({
    _id: ticketId,
    'createdBy._id': userId,
  });
};

/**
 * Find all tickets by user ID
 */
export const findTicketsByUserId = async (userId, filters = {}) => {
  const query = { 'createdBy._id': userId };
  
  if (filters.type) {
    query.type = filters.type;
  }

  return Ticket.find(query).sort({ createdAt: -1 });
};

/**
 * Count tickets by user ID
 */
export const countTicketsByUserId = async (userId, type = null) => {
  const query = { 'createdBy._id': userId };
  
  if (type) {
    query.type = type;
  }

  return Ticket.countDocuments(query);
};

/**
 * Update ticket by ID
 */
export const updateTicketById = async (ticketId, userId, updateData) => {
  return Ticket.findOneAndUpdate(
    { _id: ticketId, 'createdBy._id': userId },
    updateData,
    { new: true }
  );
};

/**
 * Delete ticket by ID
 */
export const deleteTicketById = async (ticketId, userId) => {
  return Ticket.findOneAndDelete({
    _id: ticketId,
    'createdBy._id': userId,
  });
};
