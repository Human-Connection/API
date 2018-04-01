module.exports = (belongs = true) => hook => {
  const itemBelongsToAuthenticatedUser = Boolean(hook.params.user && hook.result && hook.params.user._id.toString() === hook.result._id.toString());
  return itemBelongsToAuthenticatedUser === belongs;
};
