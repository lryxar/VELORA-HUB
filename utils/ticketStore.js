const fs = require('node:fs');
const path = require('node:path');

const VALID_TICKET_TYPES = new Set(['support', 'purchase']);

function normalizeTicketType(type) {
  const normalized = String(type || '').trim().toLowerCase();
  if (!VALID_TICKET_TYPES.has(normalized)) {
    throw new TypeError(`Invalid ticket type: ${type}`);
  }
  return normalized;
}

function emptyStore() {
  return { tickets: [] };
}

function readTicketStore(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return emptyStore();
    }

    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!parsed || !Array.isArray(parsed.tickets)) {
      return emptyStore();
    }

    return parsed;
  } catch {
    return emptyStore();
  }
}

function writeTicketStore(filePath, store) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(store, null, 2)}\n`);
}

function findOpenTicket(store, userId, type) {
  const ticketType = normalizeTicketType(type);
  return store.tickets.find((ticket) => (
    ticket.userId === userId
    && ticket.type === ticketType
    && ticket.status !== 'closed'
  )) || null;
}

function canOpenTicket(store, userId, type) {
  return findOpenTicket(store, userId, type) === null;
}

function createTicket(store, ticket) {
  const ticketType = normalizeTicketType(ticket.type);

  if (!canOpenTicket(store, ticket.userId, ticketType)) {
    throw new Error(`User ${ticket.userId} already has an open ${ticketType} ticket`);
  }

  const createdTicket = {
    ...ticket,
    type: ticketType,
    status: ticket.status || 'open',
    createdAt: ticket.createdAt || new Date().toISOString(),
  };

  store.tickets.push(createdTicket);
  return createdTicket;
}

module.exports = {
  VALID_TICKET_TYPES,
  canOpenTicket,
  createTicket,
  findOpenTicket,
  normalizeTicketType,
  readTicketStore,
  writeTicketStore,
};
