//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-create

const logger = require('winston');
const assert = require('assert');
const ElasticsearchWrapper = require('../../../server/services/search/elasticsearch.wrapper');
const { appMock, ESMock, esClientMock } = require('./esTestHelper');

describe('ElasticsearchWrapper', () => {


  //if (app.get('seeder').dropDatabase === true) {
  // if (app.get('elasticsearch).enable === false ){


  it('should disable elastic search by config param', function(done) {
    let cut = new ElasticsearchWrapper(appMock(true));

    //GIVEN: app configuration with disabled elasticsearch
    //WHEN
    //THEN
    assert.ok(cut.isDisabled(), 'ElasticSearch should be disabled');
    done();

  });

  it('should disable elastic search by config with undefined config value', function(done) {

    //GIVEN: app configuration with disabled elasticsearch
    let cut = new ElasticsearchWrapper(appMock(true));
    //WHEN
    //THEN

    assert.ok(cut.isDisabled(), 'ElasticSearch should be disabled');
    done();

  });

  it('should enable elastic search by config', function(done) {

    //GIVEN: app configuration with enabled elasticsearch
    let cut = new ElasticsearchWrapper(appMock(true));
    //WHEN
    //THEN
    assert.ok(!cut.isDisabled(), 'ElasticSearch should be enabled');
    done();
  });

  it('should not throw an error when deleting an undefined contribution', function(done) {
    let cut = new ElasticsearchWrapper();

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



