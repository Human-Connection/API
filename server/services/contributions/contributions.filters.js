/* eslint no-console: 1 */
console.warn('You are using the default filter for the contributions service. For more information about event filters see https://docs.feathersjs.com/api/events.html#event-filtering'); // eslint-disable-line no-console

const logger = require('winston');
const ElasticsearchWrapper = require('../search/elasticsearch.wrapper');

//ToDo: Implement some kind of channel for subscriptions
module.exports = function (data, connection, hook) { // eslint-disable-line no-unused-vars
  // console.log("ES002: data:" + JSON.stringify(data));
  // console.log("ES002: connection:" + JSON.stringify(connection));
  // console.log("ES002: hook:" + JSON.stringify(hook));

  let es = new ElasticsearchWrapper();
  
  try {
      logger.info('ES001 filter.data:' + JSON.stringify(data));
        
      es.add(data);

    } catch (error) {
      logger.error('Error:' + error);
    }

  return data;
};
