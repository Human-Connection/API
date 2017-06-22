const accountService = require('../services/auth-management/notifier');

module.exports = () => hook => {

  if (!hook.params.provider) { return hook; }

  const user = hook.result;

  if(hook.app.get('defaultEmail') && hook.data && hook.data.email && user) {
    // TODO: Don't send mails while seeder is seeding
    // TODO: Remove this restriction
    console.log(hook.data.email);
    if(hook.data.email !== 'jb@visualjerk.de') {
      return hook;
    }
    accountService(hook.app).notifier('resendVerifySignup', user);
    return hook;
  }

  return hook;
}
