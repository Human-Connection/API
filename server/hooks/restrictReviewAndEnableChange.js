const { getByDot, deleteByDot } = require('feathers-hooks-common');

module.exports = function restrictReviewAndEnableChange () { // eslint-disable-line no-unused-vars
  return (hook) => {

    if (!getByDot(hook, 'params.before')) {
      throw new Error('The "restrictReviewAndEnableChange" hook should be used after the "stashBefore()" hook');
    }

    const role = getByDot(hook, 'params.user.role');
    const isModOrAdmin = role && ['admin', 'moderator'].includes(role);
    const isReviewed = getByDot(hook, 'params.before.isReviewed');
    const userId = getByDot(hook, 'params.user._id');
    const isOwner = userId && getByDot(hook, 'params.before.userId');

    // only allow mods and admins to change the review status
    if (!isModOrAdmin) {
      deleteByDot(hook.data, 'isReviewed');
    }

    // only allow changes to mods, admin and owners (if its already reviewed)
    if (!isModOrAdmin && (!isOwner || (isOwner && !isReviewed))) {
      deleteByDot(hook.data, 'isEnabled');
    }

    return hook;
  };
};

