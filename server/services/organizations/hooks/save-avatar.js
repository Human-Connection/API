// ToDo: make this hook universal
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    return new Promise(resolve => {
      const uploadService = hook.app.service('uploads');
      const uploadsUrl = hook.app.get('baseURL') + '/uploads/';
      const uri = hook.data.avatarUri;

      if(!uri) {
        return resolve(hook);
      }

      uploadService.create({ uri: uri })
        .then(result => {
          hook.data.avatar = uploadsUrl + result.id;
          resolve(hook);
        })
        .catch(error => {
          hook.app.error(error);
          resolve(hook);
        });
    });
  };
};
