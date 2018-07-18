const { getByDot } = require('feathers-hooks-common');

// Check if user is owner and has admin role on this item, or is moderator
module.exports = () => hook => {
  if (hook.type !== 'before') {
    throw new Error('The "isAdminOwnerOrModeratorBoolean" hook should only be used as a "before" hook.');
  }

  if (!getByDot(hook, 'params.before')) {
    throw new Error('The "isAdminOwnerOrModeratorBoolean" hook should be used after the "stashBefore()" hook');
  }

  // If no user is given -> deny
  if(!hook.params || !hook.params.user) {
    return false;
  }

  // If user is admin or moderator -> allow
  if (['admin', 'moderator'].includes(hook.params.user.role)) {
    return true;
  }

  // If user is owner and has admin role -> allow
  const userId = getByDot(hook, 'params.user._id');
  const users = getByDot(hook, 'params.before.users');
  const owner = userId && users &&
    users.find(({id}) => id === userId.toString());

  return owner && owner.role === 'admin';
};
