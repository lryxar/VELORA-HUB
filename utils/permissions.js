function hasPermission(member, commandName, permissionsConfig = {}, guildOwnerId) {
  const defaults = permissionsConfig.defaults || {};
  const command = permissionsConfig.commands?.[commandName] || {};
  if (defaults.ownerBypass && member?.id === guildOwnerId) return true;
  if (defaults.developerIds?.includes(member?.id)) return true;
  if ((defaults.administratorBypass || command.administrator) && member?.permissions?.has?.('Administrator')) return true;
  const allowedRoles = command.roles || [];
  if (!allowedRoles.length && !command.administrator) return true;
  return allowedRoles.some((roleId) => member?.roles?.cache?.has?.(roleId));
}

module.exports = { hasPermission };
