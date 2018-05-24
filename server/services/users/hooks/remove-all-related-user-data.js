
const errors = require('feathers-errors');

module.exports = () => {
  return async (hook) => {
    async function deleteData (service, query) {
      try {
        return await hook.app.service(service).remove(null, {query});
      } catch (err) {
        console.log('ERROR ON SERVICE', service);
        throw new errors.GeneralError(err.message);
      }
    }

    if (hook.method !== 'remove') {
      hook.app.error('removeAllRelatedUserData hook works only on remove');
      return hook;
    }

    const user = hook.params.user;
    if (!user || !user._id) {
      throw new errors.Forbidden('Forbidden');
    }

    const query = hook.params.query;

    let res;

    if (query.deleteContributions === true) {
      await deleteData('contributions', {
        userId: user._id,
        type: 'post'
      });
    }
    if (query.deleteCandos === true) {
      await deleteData('contributions', {
        userId: user._id,
        type: 'cando'
      });
    }
    if (query.deleteComments === true) {
      await deleteData('comments', {
        userId: user._id
      });
    }
    // TODO: find a way to remove shouts without error
    // await deleteData('shouts', {
    //   userId: user._id
    // });
    await deleteData('users-candos', {
      userId: user._id
    });
    await deleteData('notifications', {
      userId: user._id
    });
    await deleteData('usersettings', {
      userId: user._id
    });
    await deleteData('invites', {
      email: user.email
    });

    // throw new errors.FeathersError('BOOOM');
    return hook;
  };
};
