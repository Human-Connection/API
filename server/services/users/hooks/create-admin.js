// Create admin user
module.exports = () => hook => {
  return new Promise(resolve => {
    const userService = hook.app.service('users');
    userService.find()
      .then(result => {
        // If this is our first user make him almighty
        if(result.data.length === 0) {
          hook.data.role = 'admin';
        }
        resolve(hook);
        return;
      })
      .catch(error => {
        hook.app.error(error);
        resolve(hook);
        return;
      });
  });
};
