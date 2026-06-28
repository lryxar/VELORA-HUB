const { REST, Routes, SlashCommandBuilder } = require('discord.js');

function buildSlashCommands() {
  return [
    new SlashCommandBuilder()
      .setName('help')
      .setDescription('يعرض كل أوامر البوت ومن يستطيع استخدامها وشرح كل أمر.')
      .toJSON(),
  ];
}

async function registerSlashCommands(client, token) {
  if (!client.application?.id) return;
  const rest = new REST({ version: '10' }).setToken(token);
  await rest.put(Routes.applicationCommands(client.application.id), { body: buildSlashCommands() });
}

module.exports = { buildSlashCommands, registerSlashCommands };
