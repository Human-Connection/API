// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const crypto = require('crypto');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations

    if (hook.data && !hook.data.avatar) {
      const emailhash = crypto.createHmac('sha256', hook.data.email).digest('hex');
      hook.data.avatar = `https://api.adorable.io/avatars/250/${emailhash}.png`;
    }

    return hook;
  };
};
