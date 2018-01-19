// Delete role from data if user is no admin
module.exports = () => hook => {
  if(!hook.params || !hook.params.user || hook.params.user.role !== 'admin') {
    delete hook.data.role;
  }
  return hook;
};
