const VALID_TYPES = ['support', 'purchase'];

module.exports = {
  category: 'التخصيص',
  name: 'ticket',
  usage: '$ticket <mode|title|description|log|staff|category|name|welcome|enable|disable> ...',
  description: 'تخصيص نظام التذاكر: أزرار/قائمة، العنوان، الأنواع، الرومات، اللوقات، الرتب، ورسائل الترحيب.',
  async execute(message, args, context) {
    const action = args.shift()?.toLowerCase();
    const type = args.shift()?.toLowerCase();

    if (action === 'mode') {
      const mode = type === 'select' ? 'select' : 'buttons';
      context.configs.setPath('tickets', 'panel.mode', mode);
      return message.reply(`✅ تم اختيار طريقة عرض التذاكر: ${mode === 'select' ? 'قائمة' : 'أزرار'}.`);
    }

    if (!VALID_TYPES.includes(type)) {
      return message.reply('الاستخدام: `$ticket title support العنوان` أو `$ticket log purchase #room` أو `$ticket mode buttons|select`.');
    }

    const base = `${type}`;
    const value = args.join(' ');
    if (action === 'title') context.configs.setPath('tickets', `${base}.panel.title`, value);
    else if (action === 'description') context.configs.setPath('tickets', `${base}.panel.description`, value);
    else if (action === 'name') context.configs.setPath('tickets', `${base}.nameFormat`, value || `${type}-{number}`);
    else if (action === 'welcome') context.configs.setPath('tickets', `${base}.welcomeMessage`, value);
    else if (action === 'enable') context.configs.setPath('tickets', `${base}.enabled`, true);
    else if (action === 'disable') context.configs.setPath('tickets', `${base}.enabled`, false);
    else if (action === 'log') context.configs.setPath('tickets', `${base}.logChannelId`, message.mentions.channels.first()?.id || args[0]?.replace(/[<#>]/g, ''));
    else if (action === 'staff') context.configs.setPath('tickets', `${base}.staffRoleId`, message.mentions.roles.first()?.id || args[0]?.replace(/[<@&>]/g, ''));
    else if (action === 'category') context.configs.setPath('tickets', `${base}.categoryId`, args[0]);
    else return message.reply('إجراء غير معروف. جرب: mode, title, description, log, staff, category, name, welcome, enable, disable');

    return message.reply('✅ تم تحديث إعدادات التذاكر.');
  },
};
