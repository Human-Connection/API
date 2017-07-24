module.exports = function (data, connection) {
  // Users can only listen to their own notifications
  if(!connection.user || connection.user._id != data.userId) {
    return false;
  }

  return data;
};
