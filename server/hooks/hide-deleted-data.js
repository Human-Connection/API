// Remove data from deleted items
const _ = require('lodash');
const keepFields = [
  '_id',
  'deleted',
  'createdAt',
  'updatedAt'
]

module.exports = () => hook => {
  if (!hook.result) {
    return hook;
  }
  const data = !_.isEmpty(hook.result.data) ? hook.result.data : hook.result;

  _.castArray(data).forEach(item => {
    if(item.deleted) {
      Object.keys(item).forEach(key => {
        if (!keepFields.includes(key)) {
          delete item[key];
        }
      });
    }
  });

  return hook;
};