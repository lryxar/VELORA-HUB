module.exports = { name: 'userinfo', description: 'Show user info.', execute: (message) => message.reply(`User: ${message.mentions.users.first()?.tag || message.author.tag}`) };
