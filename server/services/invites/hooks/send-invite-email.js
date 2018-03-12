const accountService = require('../../../services/auth-management/notifier');

module.exports = () => hook => {
  const invite = hook.result;

  if (hook.app.get('defaultEmail') && hook.data && hook.data.sendEmail === true && invite.email) {
    accountService(hook.app).notifier('sendInviteEmail', invite);
    return hook;
  } else {
    hook.app.error('issue sending invite email');
  }

  return hook;
};
