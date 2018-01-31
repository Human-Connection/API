// Check if the query is for a single item
module.exports = () => hook => {
  if (hook && hook.params && hook.params.query && hook.params.query.$limit === 1) {
    return true;
  } else {
    return false;
  }
};