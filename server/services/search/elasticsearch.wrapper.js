'use strict';

const logger = require('winston');
const elasticsearch = require('elasticsearch');

/**
 * test query: http://localhost:3030/search?token=bird
 */
class ElasticsearchWrapper {

  setApp(app) {
    this.app = app;
  }

  find(params) {
    logger.info('SearchService.find');
    let app = this.app;
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

    return client.search(query);

  }

  getClient() {
    let client = new elasticsearch.Client({
      host: 'localhost:9200',
      apiVersion: '5.6'
    });
    return client;
  }

}



module.exports = ElasticsearchWrapper;
