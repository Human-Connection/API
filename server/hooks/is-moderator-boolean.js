// Check if user is moderator
module.exports = () => hook => {
  if(!hook.params || !hook.params.user) {
    return false;
  }
  return ['admin', 'moderator'].includes(hook.params.user.role);
};
