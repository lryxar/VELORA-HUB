const { buildEmbed } = require('../../utils/embed');
module.exports = { name: 'embed', description: 'Send a basic embed.', execute: (message, args) => message.channel.send({ embeds: [buildEmbed({ title: 'VELORA HUB', description: args.join(' '), color: '#5865F2', timestamp: true })] }) };
