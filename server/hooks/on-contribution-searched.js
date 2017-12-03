// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const logger = require('winston');
const ElasticsearchWrapper = require('../services/search/elasticsearch.wrapper');
const search = require('feathers-mongodb-fuzzy-search');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    let es = new ElasticsearchWrapper();
    es.setApp(hook.app);
    if (es.isEnabled()) {
      logger.debug('on-contributions-searched.hook :: on contribution searched:');
      try {
        let data = hook.result;
        logger.debug('on-contributions-searched.hook :: hook.data:' + JSON.stringify(data));
        es.find(data);
      } catch (error) {
        logger.error('on-contributions-searched.hook :: Error:' + error);
      }
    }else{
      logger.debug("on-contributions-searched.hook :: ElasticSearch DISABLED, using default find method... START");
      //search()
      logger.debug("on-contributions-searched.hook :: ElasticSearch DISABLED, using default find method... DONE");
    }
    return Promise.resolve(hook);
  };
};
