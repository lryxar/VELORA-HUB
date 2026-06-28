const { buildHelpEmbed } = require('../../utils/helpBuilder');

module.exports = {
  category: 'عام',
  name: 'help',
  usage: '/help أو !help',
  description: 'يعرض كل الأوامر، شرحها، ومن يستطيع استخدامها.',
  execute(message, args, context) {
    const embed = buildHelpEmbed(context.commands, context.configs.get('permissions'), context.configs.get('language'));
    return message.reply({ embeds: [embed] });
  },
};
