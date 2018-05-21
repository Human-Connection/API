// Add deleted items
module.exports = () => hook => {
  if (!hook.params || !hook.params.query) {
    return hook;
  }
  delete hook.params.query.deleted;
  return hook;
};