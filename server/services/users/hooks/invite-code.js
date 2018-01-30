const errors = require('feathers-errors');

// ToDo: make this hook universal
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return {
    before: async function (hook) {
      // check the invite code for the given email / code combination
      const query = {
        query: {
          email: hook.data.email,
          code: hook.data.inviteCode
        }
      };
      const inviteRes = await hook.app.service('invites').find(query);
      // throw an error if the invite code does not match the one from the invite
      if (!inviteRes.data.length) {
        throw new errors.Forbidden('invite code is invalid');
      }
      
      // set some user data from the invite like batches and roles
      hook.data.wasInvited = true;
      hook.data.inviteId = inviteRes.data[0]._id;
      hook.data.role = inviteRes.data[0].role;
      hook.data.badgeIds = inviteRes.data[0].badgeIds;

      return hook;
    },
    after: async function (hook) {
      if (hook.result.wasInvited !== true) {
        return hook;
      }

      // mark the used inviteCode as used
      hook.app.service('invites').patch(hook.data.inviteId, {
        wasUsed: true
      }).then(res => {
        hook.app.debug(res);
      }).catch(err => {
        hook.app.error(err);
      });

      return hook;
    }
  };
};
