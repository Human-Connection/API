const dauria = require('dauria');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    if (!hook.data.uri && hook.params.file) {
      const file = hook.params.file;
      const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
      hook.data = { uri: uri };

      return hook;
    }
  };
};
