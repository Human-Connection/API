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

    this.enabled = !!(app.get('elasticsearch')).enable;
    this.app.debug("ElasticsearchWrapper.ctor: this.enabled:" + this.enabled);

    this.config = Object.assign({
      enabled: false,
      host: 'localhost:9200'
    }, app.get('elasticsearch'));

  }


  /**
  * find an entry inside ElasticSearch
  *
  * @param {*} params
  */
  async find(params) {
    this.app.debug("find by params:" + JSON.stringify(params));
    if (this.isDisabled()) {
      return this.findByContributionService(params);
    }
    return this.runElasticSearch(params);
  }

  async findByContributionService(params) {
    this.app.debug("ES disabled...");
    this.app.debug("forwarding request to forwarding service");
    this.app.debug("find params:" + JSON.stringify(params));
    //{\"query\":{\"$skip\":0,\"$sort\":{\"createdAt\":-1},\"$search\":\"dolo\"},\"provider\":\"socketio\"}"
    const defaultParams = {
      query: {
        $skip: params.query.$skip,
        $sort: params.query.$sort,
        $search: params.query.$search
      },
      provider: params.provider
    }
    this.app.debug("defaultParams:" + JSON.stringify(defaultParams));
    let contributionResult = await this.forwardingService.find(defaultParams);
    return contributionResult;
  }

  async runElasticSearch(params) {
    this.app.debug('ElasticSearchWrapper.find');
    //find by params:{"query":{"$skip":0,"$sort":{"createdAt":-1},"$search":"et"},"provider":"socketio"}
    this.app.debug('find by params:' + JSON.stringify(params));

    const token = params.query.$search;
    this.app.debug("token:" + token);


    if (!token) {
      return this.getDefaultResponse();
    }

    let categoryIds = params.query.$categoryIds;
    //categoryIds = [];
    categoryIds = ["5a338727bca260053d934507"];
    this.app.debug("categoryIds:" + categoryIds);

    // START SEARCH
    let client = this.getClient();

    let query = this.buildSearchQuery(token, categoryIds);
    this.app.debug("search query:\n" + JSON.stringify(query));

    let result = await client.search(query);
    //this.app.debug('search result:' + JSON.stringify(result));
    let totalHits = result.hits.total;
    if (totalHits === 0) {
      result = this.getDefaultResponse();
    } else {

      let value = this.getDefaultResponse();
      value.total = result.hits.total;

      for (var i = 0; i < result.hits.hits.length; i++) {
        value.data[i] = result.hits.hits[i]._source.value;
      }

      //this.app.debug('result value:' + JSON.stringify(value));
      result = value;

    }
    return result;
  }

  setForwardingService(service) {
    this.forwardingService = service;
  }

  /**
   * check if elastic search is enabled and configured properly
   * @returns {boolean}
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * check if elastic search is disabled
   * @returns {boolean}
   */
  isDisabled() {
    return !(this.isEnabled());
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
    this.app.info('add contribution: ' + JSON.stringify(contribution));

    let NEW_ID = '' + contribution._id;
    let addResult = '';
    try {
      addResult = await client.create({
        index: this.getESIndex(),
        type: 'contribution',
        id: NEW_ID,
        body: {
          title: contribution.title,
          content: contribution.content,
          selectedCategoryIds: JSON.stringify(contribution.categoryIds),
          value: contribution
        }
      });

    } catch (error) {
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
      index: this.getESIndex(),
      type: 'contribution',
      id: NEW_ID,
    });
    try {
      addResult = await client.create({
        index: this.getESIndex(),
        type: 'contribution',
        id: NEW_ID,
        body: {
          title: contribution.title,
          content: contribution.content,
          selectedCategoryIds: JSON.stringify(contribution.categoryIds),
          value: contribution
        }
      });

    } catch (error) {
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
    if (this.isDisabled()) {
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
        index: this.getESIndex(),
        type: 'contribution',
        id: '' + contribution._id
      });
      this.app.debug('130');
    } catch (error) {
      this.app.error('error:' + error);
      this.app.error('delete contribution error: ' + JSON.stringify(error));
    }
    return deleteResult;
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
      index: this.getESIndex(),
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
      log: 'trace'
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

  /**
   * 
   * @param {*} index 
   */
  setESIndex(index) {
    this.esIndex = index;
  }

  /**
   * 
   */
  getESIndex() {
    if (this.esIndex) {
      return this.esIndex;
    }
    return 'hc';
  }

  buildSearchQuery(token, categoryIds) {



    let query = {
      index: this.getESIndex(),
      type: 'contribution',
      body: {
        query: {
          bool: {
            must: [
              {
                bool: {
                  must: []
                }
              },
              {
                bool: {
                  must: [
                    {
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
                                boost: 2.0
                              }
                            }
                          },
                          {
                            fuzzy: {
                              content: {
                                value: token,
                                fuzziness: 'AUTO',
                                prefix_length: 0,
                                max_expansions: 20,
                                transpositions: false,
                                boost: 1.0
                              }
                            }
                          }
                        ],
                        boost: 1.0
                      }
                    }
                  ]
                }
              }
            ]
          }

        } //end query
      }
    };

    if (categoryIds) {
      for (let i = 0; i < categoryIds.length; i++) {
        query.body.query.bool.must[0].bool.must[i] = {
          match: {
            selectedCategoryIds: {
              query: categoryIds[i],
              type: 'phrase'
            }
          }
        };
      }

    }


    return query;
  }

} // end class


module.exports = ElasticsearchWrapper;
