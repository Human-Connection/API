// Check if user is admin
const errors = require('feathers-errors');

module.exports = () => hook => {
  if(!hook.params || !hook.params.user || hook.params.user.role !== 'admin') {
    throw new errors.Forbidden('You don\'t have admin rights.');
  }
  return hook;
};
