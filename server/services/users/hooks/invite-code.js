const errors = require('@feathersjs/errors');

// ToDo: make this hook universal
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return {
    before: async function (hook) {
      // check the invite code for the given email / code combination
      let query = {
        query: {
          email: hook.data.email,
          code: hook.data.inviteCode
        }
      };
      if (hook.data.invitedByUserId) {
        // invite was created
        delete query.query.email;
        query.query.invitedByUserId = hook.data.invitedByUserId;
      }
      const inviteRes = await hook.app.service('invites').find(query);
      // throw an error if the invite code does not match the one from the invite
      if (inviteRes.data.length !== 1) {
        throw new errors.Forbidden('invite code is invalid');
      }

      if (inviteRes.data[0].wasUsed) {
        throw new errors.Forbidden('invite already used');
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
