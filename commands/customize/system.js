module.exports = {
  category: 'التخصيص',
  name: 'system',
  usage: '$system <welcome|suggestions|reviews|tax|logs> <on|off>',
  description: 'تشغيل أو إيقاف الأنظمة من داخل الديسكورد.',
  execute(message, args, context) {
    const system = args[0]?.toLowerCase();
    const enabled = args[1]?.toLowerCase();
    if (!['welcome', 'suggestions', 'reviews', 'tax', 'logs'].includes(system) || !['on', 'off'].includes(enabled)) {
      return message.reply('الاستخدام: `$system welcome on` أو `$system tax off`');
    }
    context.configs.setPath('systems', `${system}.enabled`, enabled === 'on');
    return message.reply('✅ تم تحديث حالة النظام.');
  },
};
