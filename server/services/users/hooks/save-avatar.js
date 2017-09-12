// ToDo: make this hook universal
const logger = require('winston');
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    return new Promise(resolve => {
      const uploadService = hook.app.service('uploads');
      const uploadsUrl = hook.app.get('uploads');
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
          logger.log(error);
          resolve(hook);
        });
    });
  };
};
