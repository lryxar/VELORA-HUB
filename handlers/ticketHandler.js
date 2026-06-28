const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { createTicket, readTicketStore, writeTicketStore } = require('../utils/ticketStore');

function formatTicketName(format, values) {
  return format.replaceAll('{number}', String(values.number)).replaceAll('{username}', values.username).replaceAll('{id}', values.userId);
}

async function openTicket(interaction, type, context) {
  const ticketsConfig = context.configs.get('tickets');
  const typeConfig = ticketsConfig[type];
  if (!typeConfig?.enabled) return interaction.reply({ content: 'This ticket type is disabled.', ephemeral: true });
  const store = readTicketStore(context.ticketStorePath);
  const number = (store.counters?.[type] || 0) + 1;
  const name = formatTicketName(typeConfig.nameFormat || `${type}-{number}`, {
    number,
    username: interaction.user.username.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    userId: interaction.user.id,
  });
  const channel = await interaction.guild.channels.create({
    name,
    type: ChannelType.GuildText,
    parent: typeConfig.categoryId || null,
    permissionOverwrites: [
      { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      ...(typeConfig.staffRoleId ? [{ id: typeConfig.staffRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }] : []),
    ],
  });
  createTicket(store, { id: `${type}-${number}`, channelId: channel.id, userId: interaction.user.id, type });
  store.counters = { ...(store.counters || {}), [type]: number };
  writeTicketStore(context.ticketStorePath, store);
  await channel.send(typeConfig.welcomeMessage.replaceAll('{user}', `<@${interaction.user.id}>`));
  return interaction.reply({ content: `Created ${channel}.`, ephemeral: true });
}

module.exports = { formatTicketName, openTicket };
