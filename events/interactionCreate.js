module.exports = {
  name: 'interactionCreate',
  execute: async (interaction, context) => {
    if (!interaction.isButton?.()) return;
    if (interaction.customId === 'ticket:support') return context.openTicket(interaction, 'support', context);
    if (interaction.customId === 'ticket:purchase') return context.openTicket(interaction, 'purchase', context);
  },
};
