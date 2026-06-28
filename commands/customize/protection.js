module.exports = {
  category: 'التخصيص',
  name: 'protection',
  usage: '$protection <low|medium|strong|off>',
  description: 'تحديد مستوى حماية السيرفر: خفيف، متوسط، قوي، أو إيقاف.',
  execute(message, args, context) {
    const level = args[0]?.toLowerCase();
    const map = { low: 'low', medium: 'medium', strong: 'strong', off: 'off' };
    if (!map[level]) return message.reply('اختر مستوى: low أو medium أو strong أو off');
    context.configs.setPath('systems', 'protection.enabled', level !== 'off');
    context.configs.setPath('systems', 'protection.level', map[level]);
    return message.reply(`✅ تم ضبط الحماية على: ${map[level]}`);
  },
};
