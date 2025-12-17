import * as ticketDatasource from '../../datasource/ticket.datasource.js';

/**
 * Create new ticket
 */
export const createTicket = async (req, res) => {
  const { subject, message, file } = req.body;

  try {
    const ticketData = {
      createdBy: {
        _id: req.user.id,
        email: req.user.email,
      },
      subject,
      message,
      file: file || "",
      status: "submitted",
    };

    const ticket = await ticketDatasource.createTicket(ticketData);

    res.status(201).json({
      message: 'Ticket created successfully',
      data: ticket,
    });
  } catch (error) {
    console.error('Create Ticket Error:', error);
    res.status(500).json({
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
};

/**
 * Get all tickets for current user
 */
export const getTickets = async (req, res) => {
  try {
    const tickets = await ticketDatasource.findTicketsByUserId(req.user.id);

    res.status(200).json({
      data: tickets,
      total: tickets.length,
    });
  } catch (error) {
    console.error('Get Tickets Error:', error);
    res.status(500).json({
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
};

/**
 * Get ticket by ID
 */
export const getTicketById = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await ticketDatasource.findTicketByIdAndUserId(
      id,
      req.user.id
    );

    if (!ticket) {
      return res.status(404).json({
        message: 'Ticket not found',
        code: 'TICKET_NOT_FOUND',
      });
    }

    res.status(200).json({
      data: ticket,
    });
  } catch (error) {
    console.error('Get Ticket By ID Error:', error);
    res.status(500).json({
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
};

/**
 * Update ticket by ID
 */
export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { subject, message, file, status } = req.body;

  try {
    const updateData = {};

    if (subject !== undefined) updateData.subject = subject;
    if (message !== undefined) updateData.message = message;
    if (file !== undefined) updateData.file = file;
    if (status !== undefined) updateData.status = status;

    const ticket = await ticketDatasource.updateTicketById(
      id,
      req.user.id,
      updateData
    );

    if (!ticket) {
      return res.status(404).json({
        message: 'Ticket not found',
        code: 'TICKET_NOT_FOUND',
      });
    }

    res.status(200).json({
      message: 'Ticket updated successfully',
      data: ticket,
    });
  } catch (error) {
    console.error('Update Ticket Error:', error);
    res.status(500).json({
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
};

/**
 * Delete ticket by ID
 */
export const deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await ticketDatasource.findTicketByIdAndUserId(
      id,
      req.user.id
    );

    if (!ticket) {
      return res.status(404).json({
        message: 'Ticket not found',
        code: 'TICKET_NOT_FOUND',
      });
    }

    await ticketDatasource.deleteTicketById(id, req.user.id);

    res.status(200).json({
      message: 'Ticket deleted successfully',
      data: ticket,
    });
  } catch (error) {
    console.error('Delete Ticket Error:', error);
    res.status(500).json({
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
};
