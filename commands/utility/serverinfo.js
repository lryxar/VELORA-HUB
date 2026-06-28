module.exports = { name: 'serverinfo', description: 'Show server info.', execute: (message) => message.reply(`Server: ${message.guild.name}\nMembers: ${message.guild.memberCount}`) };
