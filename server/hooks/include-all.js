module.exports = () => hook => {
  if (!hook.params._includeAll) {
    return hook;
  }
  if (hook.params.query.deleted) {
    delete hook.params.query.deleted;
  }
  if (hook.params.query.isEnabled) {
    delete hook.params.query.isEnabled;
  }
  return hook;
};
