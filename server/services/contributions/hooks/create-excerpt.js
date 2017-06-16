// https://github.com/yangsibai/node-html-excerpt
const excerpt = require('html-excerpt');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    hook.data.contentExcerpt = excerpt.text(hook.data.content, 30, '...');
    return Promise.resolve(hook);
  };
};
