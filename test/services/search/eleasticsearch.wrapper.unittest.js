//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-create

const logger = require('winston');
const assert = require('assert');
const ElasticsearchWrapper = require('../../../server/services/search/elasticsearch.wrapper');
const { appMock, ESMock, esClientMock } = require('./esTestHelper');

describe('ElasticsearchWrapper', () => {

  it('should create a search query by token and category ids', ()=>{
    let cut = new ElasticsearchWrapper(appMock(true));
    const categoryIds = [
      'c1','c2','c3'
    ];

    //WHEN
    const result = cut.buildSearchQuery("abc",categoryIds);
    const resultJson = JSON.stringify(result);
    //THEN
    const expectedJson = '{"index":"hc","type":"contribution","body":{"query":{"bool":{"must":[{"bool":{"must":[{"match":{"selectedCategoryIds":{"query":"c1","type":"phrase"}}},{"match":{"selectedCategoryIds":{"query":"c2","type":"phrase"}}},{"match":{"selectedCategoryIds":{"query":"c3","type":"phrase"}}}]}},{"bool":{"must":[{"dis_max":{"tie_breaker":0.6,"queries":[{"fuzzy":{"title":{"value":"abc","fuzziness":"AUTO","prefix_length":0,"max_expansions":20,"transpositions":false,"boost":2}}},{"fuzzy":{"content":{"value":"abc","fuzziness":"AUTO","prefix_length":0,"max_expansions":20,"transpositions":false,"boost":1}}}],"boost":1}}]}}]}}}}';

    assert.equal(expectedJson,resultJson);
  });

  it('should build up a search query from search-token and categories', function(done){
    //GIVEN
    let cut = new ElasticsearchWrapper(appMock(true));
    const token = 'Human';
    const categoryIds = ['c1','c2', 'c3'];

    //WHEN
    const query = cut.buildSearchQuery(token, categoryIds);

    //THEN
    const searchQueryJson = JSON.stringify(query);
    console.log(searchQueryJson);
    

    assert.ok(query,"Query should exists");
    assert.equal(query.type,'contribution');
    

    const match0 = query.body.query.bool.must[0].bool.must[0].match;
    assert.ok(match0,  "category c1 should be first argument");
    logger.debug("match0: " + JSON.stringify(match0));

    done();
  });

  it('should disable elastic search by config param', function(done) {
    //GIVEN: app configuration with disabled elasticsearch
    let cut = new ElasticsearchWrapper(appMock(false));
    //THEN
    assert.ok(cut.isDisabled(), 'ElasticSearch should be disabled');
    done();

  });

  it('should disable elastic search by config with undefined config value', function(done) {

    //GIVEN: app configuration with disabled elasticsearch
    let undefinedValue;
    let cut = new ElasticsearchWrapper(appMock(undefinedValue));
    //WHEN
    assert.ok(cut.isDisabled(), 'ElasticSearch should be disabled');
    done();

  });

  it('should enable elastic search by config', function(done) {

    //GIVEN: app configuration with enabled elasticsearch
    let cut = new ElasticsearchWrapper(appMock(true));
    //WHEN

    //THEN
    assert.ok(cut.isEnabled(), 'ElasticSearch should be enabled');
    done();
  });

  it('should not throw an error when deleting an undefined contribution', function(done) {
    let cut = new ElasticsearchWrapper(appMock(true));

    let contribution;

    cut.delete(contribution);

    done();
  });

  it('should not throw an error when deleting a contribution with no _id field', function(done) {
    let cut = new ElasticsearchWrapper(appMock(true));

    let contribution = {};

    cut.delete(contribution);

    done();
  });

  it('should delete a contribution', function(done) {

    //GIVEN
    let cut = new ElasticsearchWrapper(appMock(true));
    let esMock = new ESMock();
    cut.setESClient(esMock);
    let contribution = {
      _id: '123'
    };

    //WHEN
    let deleteResult = cut.delete(contribution);

    //THEN: no error is expected
    let deleteParam = esMock.getDeleteParam();
    logger.debug('deleteParam:' + JSON.stringify(deleteParam));
    assert.equal(deleteParam.index, 'hc', 'index attribute should be hc');
    assert.equal(deleteParam.type, 'contribution', 'type attribute should be contribution');
    assert.equal(deleteParam.id, '123', 'id attribute should be 123');
    done();
  });

});



