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
    logger.debug("ElasticsearchWrapper setup");
  }


  /**
   * 
   * @param {*} contribution 
   */
  async add(contribution) {
    if (!contribution._id) {
      logger.debug("contribution._id is required!");
      return;
    }
    let client = this.getClient();
    logger.info("ES001 add contribution: " + JSON.stringify(contribution));

    let NEW_ID = "" + contribution._id;
    let addResult = "";
    try {
      addResult = await client.create({
        index: 'hc',
        type: 'contribution',
        id: NEW_ID,
        body: {
          title: contribution.title,
          content: contribution.content,
          value: contribution
        }
      });
      
    } catch (error) {
      logger.error("Add Contribution error: " + JSON.stringify(error));
      addResult = this.deleteAndAdd(contribution, NEW_ID, client);
    }
    return addResult;
  }
  /**
   * 
   * @param {*} contribution 
   * @param {*} NEW_ID 
   * @param {*} client 
   */
  async deleteAndAdd(contribution, NEW_ID, client) {
    let addResult = "";
    
    let deleteResult = await client.delete({
      index: 'hc',
      type: 'contribution',
      id: NEW_ID,
    });
    try {
      addResult = await client.create({
        index: 'hc',
        type: 'contribution',
        id: NEW_ID,
        body: {
          title: contribution.title,
          content: contribution.content,
          value: contribution
        }
      });
      
    } catch (error) {
      logger.error("deleteAndAdd error:" + JSON.stringify(error));
    }
    return addResult;
  }

  





  /**
   * 
   * @param {*} params 
   */
  async find(params) {
    logger.debug('SearchService.find');
    //TODO RB: use paging in es
    //find by params:{"query":{"$skip":0,"$sort":{"createdAt":-1},"$search":"et"},"provider":"socketio"}
    logger.debug('find by params:' + JSON.stringify(params));
    let token = params.query.$search;
    //let token = params.query.token;
    logger.debug('token:' + token);

    if (!token) {
      return this.getDefaultResponse();
    }

    // START SEARCH
    let client = this.getClient();

    let query = this.buildQuery(token);

    // TODO RB: using paging
    // https://www.elastic.co/guide/en/elasticsearch/guide/current/pagination.html

    let result = await client.search(query);
    logger.debug("search result:" + JSON.stringify(result));
    let totalHits = result.hits.total;
    if (totalHits === 0) {
      result = this.getDefaultResponse();
    } else {

      let value = this.getDefaultResponse();
      value.total = result.hits.total;

      for (var i = 0; i < result.hits.hits.length; i++) {
        value.data[i] = result.hits.hits[i]._source.value;
      }

      logger.debug("result value:" + JSON.stringify(value));
      result = value;

    }
    return result;
  }

  getDefaultResponse() {
    let result = {
      total: 0,
      limit: 10,
      skip: 0,
      data: []
    }
    return result;
  }

 

  buildQuery(token) {
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

    return query;
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


} // end class



module.exports = ElasticsearchWrapper;
