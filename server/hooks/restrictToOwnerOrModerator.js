const { getByDot } = require('feathers-hooks-common');
const errors = require('feathers-errors');

module.exports = function restrictToOwnerOrModerator (query = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The "restrictToOwnerOrModerator" hook should only be used as a "before" hook.');
    }
    const isFindOrGet = ['find', 'get'].includes(hook.method);
    if (!isFindOrGet && !getByDot(hook, 'params.before')) {
      throw new Error('The "restrictToOwnerOrModerator" hook should be used after the "stashBefore()" hook');
    }

    if (!hook.params || !hook.params.user) {
      return false;
    }

    const role = getByDot(hook, 'params.user.role');
    const isModOrAdmin = role && ['admin', 'moderator'].includes(role);

    const userId = getByDot(hook, 'params.user._id');
    const ownerId = getByDot(hook, 'params.before.userId');
    const isOwner = userId && ownerId && ownerId.toString() === userId.toString();

    // allow for mods or admins
    if (isModOrAdmin) {
      return hook;
    }

    // change the query if the method is find or get
    if (isFindOrGet) {
      // restrict to owner or given query
      const restrictedQuery = {
        $or: [
          { userId },
          { ...query }
        ]
      };
      hook.params.query = Object.assign(hook.params.query, restrictedQuery);
      return hook;
    }

    let hasError = false;
    const keys = Object.keys(query);
    if (!isOwner && keys.length) {
      keys.forEach((key) => {
        if (query[key] !== getByDot(hook, `params.before.${key}`)) {
          hasError = true;
        }
      });
      if (hasError) {
        // if any of the given query params is not identical with the current values this action is forbidden
        throw new errors.Forbidden('You can\'t alter this record!');
      }
    } else if (!isOwner) {
      // his action is forbidden if its not the owner
      throw new errors.Forbidden('You can\'t alter this record!');
    }

    return hook;
  };
};

