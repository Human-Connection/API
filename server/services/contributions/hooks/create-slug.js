// https://www.npmjs.com/package/slug
const slug = require('slug');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    const contributions = hook.app.service('contributions');

    hook.data.slug = slug(hook.data.title, {
      lower: true
    });
    return Promise.resolve(hook);
  };
};
