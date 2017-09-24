'use strict';

const logger = require('winston');
const elasticsearch = require('elasticsearch');

class SearchES {

  constructor() {

  }
    
  findContribution(searchtoken, callback) {
    let client = new elasticsearch.Client({
      host: 'localhost:9200',
      apiVersion: '5.5'
    });
    client.search({
      index: 'hc',
      type: 'contribution',
      body: {
        query: {
          bool: {
            should: {
              term: { title: searchtoken }
            },
            should: {
              term: { content: searchtoken }
            }
          }

        }
      }
    }, function (error, response) {
      logger.debug('error:', JSON.stringify(error));
      logger.debug('result:', JSON.stringify(response));

      callback(response);
     
    });
  }
}

module.exports = SearchES;
