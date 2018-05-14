const { getByDot, deleteByDot } = require('feathers-hooks-common');

module.exports = function restrictReviewAndEnableChange () { // eslint-disable-line no-unused-vars
  return (hook) => {

    if (!getByDot(hook, 'params.before')) {
      throw new Error('The "restrictReviewAndEnableChange" hook should be used after the "stashBefore()" hook');
    }

    const role = getByDot(hook, 'params.user.role');
    const isModOrAdmin = role && ['admin', 'moderator'].includes(role);
    const isReviewed = getByDot(hook, 'params.before.reviewedBy');
    const userId = getByDot(hook, 'params.user._id');
    const ownerId = getByDot(hook, 'params.before.userId');
    const isOwner = userId && ownerId && ownerId.toString() === userId.toString();

    // only allow mods and admins to change the review status
    if (!isModOrAdmin) {
      deleteByDot(hook.data, 'isReviewed');
    }

    // set reviewedBy to current user if the user has mod rights
    // and wants to confirm the review status
    deleteByDot(hook.data, 'reviewedBy');
    if (hook.data.isReviewed) {
      hook.data.reviewedBy = userId;
    }

    // only allow changes to mods, admin and owners (if its already reviewed)
    if (!isModOrAdmin && (!isOwner || (isOwner && !isReviewed))) {
      deleteByDot(hook.data, 'isEnabled');
    }

    return hook;
  };
};

