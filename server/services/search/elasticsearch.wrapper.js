'use strict';

const logger = require('winston');
const elasticsearch = require('elasticsearch');

/**
 * test query: http://localhost:3030/search?token=bird
 * 
 * 
 * https://gist.github.com/StephanHoyer/b9cd6cbc4cc93cee8ea6
 * 
 * 
 */
class ElasticsearchWrapper {

  setApp(app) {
    this.app = app;
  }

  dropIndex() {
    let client = this.getClient();
    client.indices.exists('hc', function (response) {
      logger.info('index exists: ' + response);
      logger.info('index exists: ' + JSON.stringify(response));
      return client.indices.delete({
        index: 'hc',
      });
    });

  }

  createIndex() {
    let client = this.getClient();
    return client.indices.create({
      index: 'hc',
      mapping: {
        contribution: {
          title: {
            type: 'string'
          }
        }
      }
    });
  }

  add(contribution) {
    let client = this.getClient();

    let creationDate = Date.now;

    return client.create({
      index: 'hc',
      type: 'contribition',
      id: contribution.title,
      body: {
        title: contribution.title,
        content: contribution.content,
        user_id: contribution.user,
        date: creationDate
      }
    });
  }

  insert(contribution, onResponse, onError) {
    let client = this.getClient();

    let creationDate = Date.now;

    client.create({
      index: 'hc',
      type: 'contribition',
      id: contribution.title,
      body: {
        title: contribution.title,
        content: contribution.content,
        user_id: contribution.user,
        date: creationDate
      }
    }, function (error, response) {
      logger.debug('response:', JSON.stringify(response));
      onResponse(response);
      onError(error);

      client.close();
    });
  }

  find(params) {
    logger.info('SearchService.find');

    logger.info('find by params:' + JSON.stringify(params));
    let token = params.query.token;
    logger.info('token:' + token);

    //START SEARCH
    let client = this.getClient();
    let query = {
      index: 'hc',
      type: 'contribution',
      body: {
        query: {
          dis_max: {
            tie_breaker: 0.6,
            queries: [
              {
                fuzzy: {
                  title: {
                    value: token,
                    fuzziness: 'AUTO',
                    prefix_length: 0,
                    max_expansions: 20,
                    transpositions: false,
                    boost: 1.0
                  }
                }
              },
              {
                fuzzy: {
                  content: {
                    value: token,
                    fuzziness: 'AUTO',
                    prefix_length: 0,
                    max_expansions: 80,
                    transpositions: false,
                    boost: 1.0
                  }
                }
              }
            ],
            boost: 1.0
          }
        }
      }
    };

    //TODO RB: filter results
    return client.search(query);

  }

  getClient() {
    let client = new elasticsearch.Client({
      host: 'localhost:9200',
      apiVersion: '5.6',
      log: 'trace'
    });
    return client;
  }

  close(client) {
    client.close();
  }

}



module.exports = ElasticsearchWrapper;
