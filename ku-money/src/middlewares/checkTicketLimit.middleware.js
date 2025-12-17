import * as subscriptionDatasource from '../datasource/subscription.datasource.js';
import * as ticketDatasource from '../datasource/ticket.datasource.js';

/**
 * Middleware to check if user has reached ticket limit
 * Must be used after authMiddleware
 */
export const checkTicketLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get active subscription
    const subscription = await subscriptionDatasource.findActiveSubscriptionByUserId(userId);

    if (!subscription) {
      return res.status(403).json({
        message: 'No active subscription found',
        code: 'NO_SUBSCRIPTION',
      });
    }

    // Get limit from subscription (rename in subscription model if needed)
    const ticketLimit = subscription.limitTicket;

    // If limit is 0 → unlimited
    if (ticketLimit === 0) {
      return next();
    }

    // Count current tickets
    const currentTicketCount = await ticketDatasource.countTicketsByUserId(userId);

    // Check if user has reached the limit
    if (currentTicketCount >= ticketLimit) {
      return res.status(403).json({
        message: `Ticket limit reached`,
        code: 'TICKET_LIMIT_REACHED',
        limit: ticketLimit,
        current: currentTicketCount,
      });
    }

    next();
  } catch (error) {
    console.error('Check Ticket Limit Error:', error);
    res.status(500).json({
      message: 'Error checking ticket limit',
      code: 'INTERNAL_ERROR',
      error: error.message,
    });
  }
};
