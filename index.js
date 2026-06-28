const path = require('node:path');

const {
  canOpenTicket,
  createTicket,
  findOpenTicket,
  readTicketStore,
  writeTicketStore,
} = require('./utils/ticketStore');

const ticketStorePath = path.join(__dirname, 'data', 'tickets.json');

module.exports = {
  canOpenTicket,
  createTicket,
  findOpenTicket,
  readTicketStore,
  ticketStorePath,
  writeTicketStore,
};
