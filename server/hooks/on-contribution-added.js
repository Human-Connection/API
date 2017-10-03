// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const logger = require('winston');
const ElasticsearchWrapper = require('../services/search/elasticsearch.wrapper');


module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    
    let es = new ElasticsearchWrapper();

    logger.info("on contribution added:");
    logger.info("hook:" + hook);
    
    try {
        logger.info("hook.data:" + JSON.stringify(hook.data));

        let data = hook.data;
        
        let contribution = {
            title: data.title,
            content: data.content,
            user: data.userId
        }
        
        es.add(contribution);

    } catch (error) {
        logger.error("Error:" + error);
    }
    

    return Promise.resolve(hook);
  };
};
