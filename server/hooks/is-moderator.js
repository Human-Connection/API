// Check if user is moderator
const errors = require('feathers-errors');

module.exports = () => hook => {
  if(!hook.params || !hook.params.user || !['admin','moderator'].includes(hook.params.user.role)) {
    throw new errors.Forbidden('You don\'t have moderator rights.');
  }
  return hook;
};
