module.exports = {
  name: 'messageCreate',
  execute: (message, context) => context.handleMessage(message, context),
};
