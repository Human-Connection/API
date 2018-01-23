// Exclude items with isEnabled = false
const errors = require('feathers-errors');

module.exports = function excludeDisabled() {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'excludeDisabled\' hook should only be used as a \'before\' hook.');
    }

    // If it was an internal call then skip this hook
    if (!hook.params.provider) {
      return hook;
    }

    if (hook.method === 'find' || hook.id === null) {
      hook.params.query.isEnabled = true;
      return hook;
    }

    // look up the document and throw a Forbidden error if the item is not enabled
    // Set provider as undefined so we avoid an infinite loop if this hook is
    // set on the resource we are requesting.
    var params = Object.assign({}, hook.params, { provider: undefined });

    return hook.service.get(hook.id, params).then(function (data) {
      if (data.toJSON) {
        data = data.toJSON();
      } else if (data.toObject) {
        data = data.toObject();
      }

      if (!data || !data.isEnabled) {
        throw new errors.Forbidden('This item is disabled.');
      }

      return hook;
    });
  };
};

