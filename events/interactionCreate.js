const { buildHelpEmbed } = require('../utils/helpBuilder');

module.exports = {
  name: 'interactionCreate',
  execute: async (interaction, context) => {
    if (interaction.isChatInputCommand?.() && interaction.commandName === 'help') {
      const embed = buildHelpEmbed(context.commands, context.configs.get('permissions'), context.configs.get('language'));
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!interaction.isButton?.()) return;
    if (interaction.customId === 'ticket:support') return context.openTicket(interaction, 'support', context);
    if (interaction.customId === 'ticket:purchase') return context.openTicket(interaction, 'purchase', context);
  },
};
