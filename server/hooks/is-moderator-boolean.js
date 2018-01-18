// Check if user is moderator
module.exports = () => hook => {
  if(!hook.params || !hook.params.user || !['admin','moderator'].includes(hook.params.user.role)) {
    return false;
  }
  return true;
};
