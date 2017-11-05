// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const logger = require('winston');
const ElasticsearchWrapper = require('../services/search/elasticsearch.wrapper');


module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    
    let es = new ElasticsearchWrapper();

    logger.info('ES001 on contribution added:');
    logger.info('ES001 hook:' + JSON.stringify(hook._id));
    
    try {
      logger.info('ES001 hook.data:' + JSON.stringify(hook.data));

      let data = hook.data;
      /*  
      let contribution = {
        title: data.title,
        content: data.content,
        user: data.userId
      };*/
        
      es.add(data);

    } catch (error) {
      logger.error('Error:' + error);
    }
    

    return Promise.resolve(hook);
  };
};
