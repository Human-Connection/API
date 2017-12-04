'use strict';

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

  /**
   * initialize the ElasticsearchWrapper
   * @param app
   */
  constructor(app) {
    this.app = app;

    this.enabled = false;
    this.config = Object.assign({
      enabled: false,
      host: 'localhost:9200'
    }, app.get('elasticsearch'));
    const esEnabledConfigValue = this.config.enabled;
    if (esEnabledConfigValue === true) {
      this.app.debug('ElasticSearchWrapper.init :: ElasticSearch enabled ... ');
      this.app.debug(this.config.host);
      this.enabled = true;
    } else {
      this.app.debug('ElasticSearchWrapper.init :: ElasticSearch disabled ... ');
    }
  }

  /**
   * check if elastic search is enabled and configured properly
   * @returns {boolean}
   */
  isEnabled() {
    return !(this.isDisabled());
  }

  /**
   * check if elastic search is disabled
   * @returns {boolean}
   */
  isDisabled() {
    const isDisabled = this.enabled === false;

    if (isDisabled === false) {
      this.app.debug('ElasticSearchWrapper.isDisabled :: ElasticSearch disbaled ');
    }

    return isDisabled;
  }

  /**
   * add an entry to ElasticSearch
   * @param {*} contribution
   */
  async add(contribution) {
    if (this.isDisabled()) {
      return;
    }

    if (!contribution._id) {
      this.app.debug('contribution._id is required!');
      return;
    }
    let client = this.getClient();
    this.app.info('ES001 add contribution: ' + JSON.stringify(contribution));

    let NEW_ID = '' + contribution._id;
    let addResult = '';
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

    } catch(error) {
      this.app.error('Add Contribution error: ' + JSON.stringify(error));
      addResult = this.deleteAndAdd(contribution, NEW_ID, client);
    }
    return addResult;
  }

  /**
   * add an entry after deleting the old entry in ElasticSearch
   *
   * @param {*} contribution
   * @param {*} NEW_ID
   * @param {*} client
   */
  async deleteAndAdd(contribution, NEW_ID, client) {

    let addResult = '';

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

    } catch(error) {
      this.app.error('deleteAndAdd error:' + JSON.stringify(error));
    }
    return addResult;
  }

  /**
   * remove an entry from ElasticSearch
   *
   * @param contribution
   * @returns {Promise<string>}
   */
  async delete(contribution) {
    if (!contribution) {
      this.app.debug('no contribution given');
      return;
    }
    if (!contribution._id) {
      this.app.debug('no contribution._id given');
      return;
    }
    this.app.debug('perform delete');

    const client = this.getClient();
    if (!client) {
      this.app.error('no ES Client available');
      return;
    }
    let deleteResult = '';
    try {
      this.app.debug('120');
      deleteResult = await client.delete({
        index: 'hc',
        type: 'contribution',
        id: '' + contribution._id
      });
      this.app.debug('130');
    } catch(error) {
      this.app.error('error:' + error);
      this.app.error('delete contribution error: ' + JSON.stringify(error));
    }
    return deleteResult;
  }


  /**
   * find an entry inside ElasticSearch
   *
   * @param {*} params
   */
  async find(params) {
    this.app.debug('ElasticSearchWrapper.find');

    //find by params:{"query":{"$skip":0,"$sort":{"createdAt":-1},"$search":"et"},"provider":"socketio"}
    this.app.debug('find by params:' + JSON.stringify(params));
    let token = params.query.$search;
    //let token = params.query.$contributions;

    this.app.debug('token:' + token);

    if (!token) {
      return this.getDefaultResponse();
    }

    // START SEARCH
    let client = this.getClient();

    let query = this.buildQuery(token);

    let result = await client.search(query);
    this.app.debug('search result:' + JSON.stringify(result));
    let totalHits = result.hits.total;
    if (totalHits === 0) {
      result = this.getDefaultResponse();
    } else {

      let value = this.getDefaultResponse();
      value.total = result.hits.total;

      for(var i = 0; i < result.hits.hits.length; i++) {
        value.data[i] = result.hits.hits[i]._source.value;
      }

      this.app.debug('result value:' + JSON.stringify(value));
      result = value;

    }
    return result;
  }

  /**
   * get the default pagination metadata
   * @returns {{total: number, limit: number, skip: number, data: Array}}
   */
  getDefaultResponse() {
    let result = {
      total: 0,
      limit: 10,
      skip: 0,
      data: []
    };
    return result;
  }

  /**
   * build the ElasticSearch Query
   * @param token
   * @returns {{index: string, type: string, body: {query: {dis_max: {tie_breaker: number, queries: *[], boost: number}}}}}
   */
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

  /**
   * set the ElasticSeach Client
   * @param client
   */
  setESClient(client) {
    this.esClient = client;
  }

  /**
   * get the ElasticSearch Client
   * @returns {*}
   */
  getClient() {
    if (this.esClient) {
      this.app.debug('return pre setup  ESClient');
      return this.esClient;
    }
    const client = new elasticsearch.Client({
      host: this.config.host,
      apiVersion: '5.6',
      log: 'debug'
    });
    this.app.debug('ElasticSearchWrapper.getClient :: using real ES Client');
    return client;
  }

  /**
   * close the connection to ElasticSearch
   * @param client
   */
  close(client) {
    client.close();
  }


} // end class


module.exports = ElasticsearchWrapper;
