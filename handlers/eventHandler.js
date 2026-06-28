const fs = require('node:fs');
const path = require('node:path');

function registerEvents(client, eventsDir, context) {
  for (const entry of fs.readdirSync(eventsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
    const event = require(path.join(eventsDir, entry.name));
    client.on(event.name, (...args) => event.execute(...args, context));
  }
}

module.exports = { registerEvents };
