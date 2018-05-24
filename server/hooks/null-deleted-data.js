// Null specific fields on deleted records
const alterItems = require('../helper/alter-items');

const defaults = {
  fields: [
    'content',
    'cando'
  ]
};

module.exports = (options = defaults) => alterItems(handleItem(options));

const handleItem = options => item => {
  if (item.deleted) {
    if (Array.isArray(options.fields)) {
      options.fields.forEach(field => {
        item[field] = 'DELETED';
      });
    } else {
      options.fields.entries.forEach(field => {
        const [key, value] = field;
        if (typeof value === 'object') {
          item[key] = handleItem(options[key])(item[key]);
        } else {
          item[field] = 'DELETED';
        }
      });
    }
  }
  return item;
};