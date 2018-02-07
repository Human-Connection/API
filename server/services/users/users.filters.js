/* eslint no-console: 1 */
module.exports = function (data, connection, hook) { // eslint-disable-line no-unused-vars
  // Users can only listen to their own events
  if(!connection.user || connection.user._id != data.userId) {
    return false;
  }
  return data;
};
