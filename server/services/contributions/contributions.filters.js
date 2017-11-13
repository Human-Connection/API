/* eslint no-console: 1 */
console.warn('You are using the default filter for the contributions service. For more information about event filters see https://docs.feathersjs.com/api/events.html#event-filtering'); // eslint-disable-line no-console

const logger = require('winston');
const ElasticsearchWrapper = require('../search/elasticsearch.wrapper');

//ToDo: Implement some kind of channel for subscriptions
module.exports = function (data, connection, hook) { // eslint-disable-line no-unused-vars
  
  /*logger.info("contribution filter - data:" + JSON.stringify(data));
  logger.info("contribution filter - hook:" + JSON.stringify(hook));
  logger.info("contribution filter - hook:" + JSON.stringify(hook.result));
  */
  return data;
};
