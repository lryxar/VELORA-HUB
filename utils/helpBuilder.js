const { EmbedBuilder } = require('discord.js');

function commandAccess(command, permissionsConfig = {}) {
  const rule = permissionsConfig.commands?.[command.name];
  if (!rule) return 'الجميع';
  if (rule.administrator) return 'الإدارة';
  if (rule.roles?.length) return `رولات محددة: ${rule.roles.join(', ')}`;
  return 'الجميع';
}

function collectUniqueCommands(commands) {
  return [...new Set(commands.values())].sort((a, b) => a.name.localeCompare(b.name));
}

function buildHelpEmbed(commands, permissionsConfig = {}, language = {}) {
  const embed = new EmbedBuilder()
    .setTitle(language.helpTitle || 'قائمة أوامر VELORA HUB')
    .setColor('#2B2DFF')
    .setDescription('بوت عربي احترافي لإدارة السيرفر، التذاكر، اللوقات، الحماية، والأنظمة القابلة للتخصيص.')
    .setFooter({ text: language.helpFooter || 'أوامر التخصيص تبدأ بـ $' })
    .setTimestamp();

  const grouped = new Map();
  for (const command of collectUniqueCommands(commands)) {
    const group = command.category || 'عام';
    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group).push(`**${command.usage || command.name}** — ${command.description || 'بدون وصف'}\nالصلاحية: ${commandAccess(command, permissionsConfig)}`);
  }

  for (const [group, lines] of grouped) {
    embed.addFields({ name: group, value: lines.join('\n\n').slice(0, 1024) || 'لا يوجد', inline: false });
  }

  return embed;
}

module.exports = { buildHelpEmbed, collectUniqueCommands, commandAccess };
