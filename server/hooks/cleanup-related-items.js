// Cleanup all related items by deleting them
const alterItems = require('../helper/alter-items');

const defaults = {
  connections: []
};

module.exports = (options = defaults) => alterItems(handleItem(options));

const handleItem = options => (item, hook) => {
  options.connections.forEach(connection => {
    deleteItem(item, connection, hook);
  });
  return item;
};

const deleteItem = async (item, connection, hook) => {
  if (!item || !connection || !connection.childField || !connection.service) {
    return;
  }
  const parentField = connection.parentField || '_id';
  let query = connection.query || {};
  query[connection.childField] = item[parentField];
  try {
    await hook.app.service(connection.service)
      .remove(null, { query });
  } catch (err) {
    hook.app.error(`issue while deleting related item '${connection.service}'`);
    hook.app.error(query);
  }

};