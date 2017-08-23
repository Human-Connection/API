/* eslint no-console: 1 */
console.warn('You are using the default filter for the contributions service. For more information about event filters see https://docs.feathersjs.com/api/events.html#event-filtering'); // eslint-disable-line no-console

//ToDo: Implement some kind of channel for subscriptions
module.exports = function (data, connection, hook) { // eslint-disable-line no-unused-vars
  return data;
};
