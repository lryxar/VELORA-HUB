const fs = require('node:fs');
const path = require('node:path');
const { hasPermission } = require('../utils/permissions');

function loadCommands(commandsDir) {
  const commands = new Map();
  for (const group of fs.readdirSync(commandsDir, { withFileTypes: true })) {
    if (!group.isDirectory()) continue;
    const groupDir = path.join(commandsDir, group.name);
    for (const entry of fs.readdirSync(groupDir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
      const command = require(path.join(groupDir, entry.name));
      commands.set(command.name, command);
      for (const alias of command.aliases || []) commands.set(alias, command);
    }
  }
  return commands;
}

async function handleMessage(message, context) {
  if (!message.guild || message.author.bot) return false;
  const config = context.configs.get('config');
  const prefixes = Object.values(config.prefixes || { admin: '!', ticket: '+' });
  const prefix = prefixes.find((value) => message.content.startsWith(value));
  if (!prefix) return false;
  const [name, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);
  const command = context.commands.get(name?.toLowerCase());
  if (!command) return false;
  const permissions = context.configs.get('permissions');
  if (!hasPermission(message.member, command.name, permissions, message.guild.ownerId)) {
    await message.reply('You do not have permission to use this command.');
    return true;
  }
  await command.execute(message, args, context);
  return true;
}

module.exports = { handleMessage, loadCommands };
