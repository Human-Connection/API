// Null specific fields on deleted records
const alterItems = require('../helper/alter-items');

const defaults = {
  fields: [
    'content'
  ]
};

module.exports = (options = defaults) => alterItems(handleItem(options));

const handleItem = options => item => {
  if (item.deleted) {
    options.fields.forEach(field => {
      item[field] = 'DELETED';
    });
  }
  return item;
};