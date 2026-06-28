const CHANNEL_KEYS = {
  welcome: ['systems', 'welcome.channelId'],
  suggestions: ['systems', 'suggestions.channelId'],
  reviews: ['systems', 'reviews.channelId'],
  tax: ['systems', 'tax.channelId'],
  ticketlog: ['systems', 'logs.ticketChannelId'],
  logs: ['systems', 'logs.defaultChannelId'],
};

function channelIdFrom(message, value) {
  return message.mentions.channels.first()?.id || value?.replace(/[<#>]/g, '');
}

module.exports = {
  category: 'التخصيص',
  name: 'set',
  usage: '$set <welcome|suggestions|reviews|tax|ticketlog|logs> #room',
  description: 'تحديد رومات الترحيب، الاقتراحات، التقييم، الضريبة، واللوقات.',
  async execute(message, args, context) {
    const key = args[0]?.toLowerCase();
    const target = CHANNEL_KEYS[key];
    if (!target) return message.reply('الاستخدام: `$set welcome #room` أو `$set suggestions #room` أو `$set reviews #room` أو `$set tax #room` أو `$set ticketlog #room`.');
    const channelId = channelIdFrom(message, args[1]);
    if (!channelId) return message.reply('حدد روم صحيح.');
    context.configs.setPath(target[0], target[1], channelId);
    return message.reply('✅ تم حفظ الروم بنجاح.');
  },
};
