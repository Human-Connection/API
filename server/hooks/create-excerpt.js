// https://github.com/yangsibai/node-html-excerpt
const excerpt = require('html-excerpt');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    if(!hook.data || !hook.data.content) {
      return hook;
    }
    hook.data.contentExcerpt = excerpt.text(hook.data.content.replace(/(<([^>]+)>)/ig, ''), 120, '...');
    return Promise.resolve(hook);
  };
};