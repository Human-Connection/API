const { getByDot } = require('feathers-hooks-common');
const { errors } = require('feathers-errors');
// const { isEmpty } = require('lodash');

module.exports = (options = {field: 'organizationId'}) => async hook => {
  const currentUserId = getByDot(hook, 'params.user._id');
  if (!currentUserId) {
    throw new errors.Forbidden('you can\'t create or edit for that organization');
  }
  // const userId = getByDot(hook, 'params.user._id') || getByDot(hook, 'data.userId');
  const organizationId = getByDot(hook, `params.${options.field}`) || getByDot(hook, `data.${options.field}`);

  if (!organizationId) {
    // ignore items without organization id
    return hook;
  }

  // get organization with the given id
  const organization = await hook.app.service('organizations').get(organizationId);

  // only allow when the user is assigned with the organization
  if (!organization || !organization.userIds.some(userId => {
    userId.toString() === currentUserId.toString();
  })) {
    throw new errors.Forbidden('you can\'t create or edit for that organization');
  }

  return hook;
};
