const path = require('node:path');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const ConfigManager = require('./utils/configManager');
const { loadCommands, handleMessage } = require('./handlers/commandHandler');
const { registerEvents } = require('./handlers/eventHandler');
const { openTicket } = require('./handlers/ticketHandler');
const { registerSlashCommands } = require('./handlers/slashCommandRegistrar');
const ticketStore = require('./utils/ticketStore');

const rootDir = __dirname;
const ticketStorePath = path.join(rootDir, 'data', 'tickets.json');

function createBot() {
  const configs = new ConfigManager(rootDir);
  configs.watch(['config', 'tickets', 'permissions', 'welcome', 'suggestions', 'reviews', 'tax', 'say', 'logs', 'language', 'systems']);
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages],
    partials: [Partials.Channel],
  });
  const context = {
    client,
    configs,
    commands: loadCommands(path.join(rootDir, 'commands')),
    handleMessage,
    openTicket,
    ticketStorePath,
    ...ticketStore,
  };
  registerEvents(client, path.join(rootDir, 'events'), context);
  client.once('ready', async () => {
    const token = configs.get('config').token || process.env.DISCORD_TOKEN;
    if (token && token !== 'PUT_YOUR_BOT_TOKEN_HERE') await registerSlashCommands(client, token);
    console.log(`VELORA HUB ready as ${client.user.tag}`);
  });
  return { client, context };
}

async function start() {
  const { client, context } = createBot();
  const token = context.configs.get('config').token || process.env.DISCORD_TOKEN;
  if (!token || token === 'PUT_YOUR_BOT_TOKEN_HERE') throw new Error('Set config.json token or DISCORD_TOKEN before starting the bot.');
  await client.login(token);
}

if (require.main === module) start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { createBot, start, ticketStorePath, ...ticketStore };
