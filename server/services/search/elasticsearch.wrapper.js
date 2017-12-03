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
    
    this.init(app);

  }

  init(app) {
    this.enabled = false;
    let esEnabledConfigValue = app.get('elasticsearch').enable;
    if (esEnabledConfigValue === true) {
      logger.debug("ElasticSearchWrapper.init :: ElasticSearch enabled ... ");
      this.enabled = true;
    }else{
      logger.debug("ElasticSearchWrapper.init :: ElasticSearch disabled ... ");
    }
  }

  isEnabled(){
    return ! (this.isDisabled());
  }
  
  isDisabled() {
    let isDisabled = this.enabled === false;

    if (isDisabled === false) {
      logger.debug("ElasticSearchWrapper.isDisabled :: ElasticSearch disbaled ");
    }

    return isDisabled;
  }

  /**
   * 
   * @param {*} contribution 
   */
  async add(contribution) {
    if (this.isDisabled()) {
      return;
    };

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


  async delete(contribution) {
    if (!contribution) {
      logger.debug('no contribution given');
      return;
    }
    if (!contribution._id) {
      logger.debug('no contribution._id given');
      return;
    }
    logger.debug('perform delete');

    let client = this.getClient();
    if (!client) {
      logger.error("no ES Client available");
      return;
    }
    let deleteResult = "";
    try {
      logger.debug("120");
      deleteResult = await client.delete({
        index: 'hc',
        type: 'contribution',
        id: "" + contribution._id
      });
      logger.debug("130");
    } catch (error) {
      logger.error("error:" + error);
      logger.error("delete contribution error: " + JSON.stringify(error));
    }
    return deleteResult;
  }




  /**
   * 
   * @param {*} params 
   */
  async find(params) {
    logger.debug('ElasticSearchWrapper.find');
    
    //find by params:{"query":{"$skip":0,"$sort":{"createdAt":-1},"$search":"et"},"provider":"socketio"}
    logger.debug('find by params:' + JSON.stringify(params));
    let token = params.query.$search;
    //let token = params.query.$contributions;
    
    logger.debug('token:' + token);

    if (!token) {
      return this.getDefaultResponse();
    }

    // START SEARCH
    let client = this.getClient();

    let query = this.buildQuery(token);

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

  setESClient(client){
    this.esClient = client;
  }

  getClient() {
    if(this.esClient){
      logger.debug("return pre setup  ESClient");
      return this.esClient;
    }
    let client = new elasticsearch.Client({
      host: 'localhost:9200',
      apiVersion: '5.6',
      log: 'debug'
    });
    logger.debug("ElasticSearchWrapper.getClient :: using real ES Client");
    return client;
  }

  close(client) {
    client.close();
  }


} // end class



module.exports = ElasticsearchWrapper;
