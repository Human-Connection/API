const accountService = require('../../../services/auth-management/notifier');

module.exports = () => hook => {

  if (!hook.params.provider) {
    console.error('no email provider configured');
    return hook;
  }

  const user = hook.result;

  if (hook.app.get('defaultEmail') && hook.data && hook.data.email && user) {
    accountService(hook.app).notifier('resendVerifySignup', user);
    return hook;
  } else {
    console.error('issue sending virification email');
  }

  return hook;
};
