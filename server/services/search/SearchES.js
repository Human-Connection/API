'use strict';

const logger = require('winston');
const elasticsearch = require('elasticsearch');

class SearchES {

  SearchES() {

    logger.debug('SearchES ctor');
  }

  getClient(){
    let client = new elasticsearch.Client({
      host: 'localhost:9200',
      apiVersion: '5.5'
    });
    return client;
  }

  removeContribution(contributionId, onError, onResponse){
    let client = this.getClient();
    client.delete({
      index: 'hc',
      type: 'contribution',
      id: contributionId
    }, function (error, response) {
      onError(error);
      onResponse(response);
    });
  }

  addContribution(titleValue, contentValue, contributionId,
    userId, dateValue, onError, onResponse) {

    let client = this.getClient();

    client.create({
      index: 'hc',
      type: 'contribition',
      id: contributionId,
      body: {
        title: titleValue,
        content: contentValue,
        user_id: userId,
        date: dateValue
      }
    }, function (error, response) {
      logger.debug('response:', JSON.stringify(response));
      onResponse(response);
    });
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
