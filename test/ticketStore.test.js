const assert = require('node:assert/strict');
const test = require('node:test');

const {
  canOpenTicket,
  createTicket,
  findOpenTicket,
  normalizeTicketType,
} = require('../utils/ticketStore');

test('normalizes supported ticket types', () => {
  assert.equal(normalizeTicketType(' Support '), 'support');
  assert.equal(normalizeTicketType('PURCHASE'), 'purchase');
});

test('rejects unsupported ticket types', () => {
  assert.throws(() => normalizeTicketType('billing'), /Invalid ticket type/);
});

test('allows one support and one purchase ticket for the same user', () => {
  const store = { tickets: [] };

  createTicket(store, {
    id: 'support-1',
    channelId: 'channel-support-1',
    userId: 'user-1',
    type: 'support',
  });

  assert.equal(canOpenTicket(store, 'user-1', 'purchase'), true);

  const purchaseTicket = createTicket(store, {
    id: 'purchase-1',
    channelId: 'channel-purchase-1',
    userId: 'user-1',
    type: 'purchase',
  });

  assert.equal(purchaseTicket.type, 'purchase');
  assert.equal(store.tickets.length, 2);
});

test('blocks duplicate open tickets only within the same ticket type', () => {
  const store = { tickets: [] };

  createTicket(store, {
    id: 'support-1',
    channelId: 'channel-support-1',
    userId: 'user-1',
    type: 'support',
  });

  assert.equal(canOpenTicket(store, 'user-1', 'support'), false);
  assert.throws(() => createTicket(store, {
    id: 'support-2',
    channelId: 'channel-support-2',
    userId: 'user-1',
    type: 'support',
  }), /already has an open support ticket/);
});

test('ignores closed tickets when checking duplicates', () => {
  const store = {
    tickets: [{
      id: 'support-1',
      channelId: 'channel-support-1',
      userId: 'user-1',
      type: 'support',
      status: 'closed',
    }],
  };

  assert.equal(findOpenTicket(store, 'user-1', 'support'), null);
  assert.equal(canOpenTicket(store, 'user-1', 'support'), true);
});
