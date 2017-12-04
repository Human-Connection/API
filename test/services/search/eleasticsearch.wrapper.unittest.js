//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-create

const logger = require('winston');
const assert = require('assert');
const ElasticsearchWrapper = require('../../../server/services/search/elasticsearch.wrapper');

describe('ElasticsearchWrapper', () => {


  //if (app.get('seeder').dropDatabase === true) {
  // if (app.get('elasticsearch).enable === false ){


  it('should disable elastic search by config param', function(done) {
    let cut = new ElasticsearchWrapper();

    //GIVEN: app configuration with disabled elasticsearch
    let app = appMock(false);
    //WHEN
    cut.setApp(app);
    //THEN
    assert.ok(cut.isDisabled(), 'ElasticSearch should be disabled');
    done();

  });

  it('should disable elastic search by config with undefined config value', function(done) {

    //GIVEN: app configuration with disabled elasticsearch
    let undefinedParam;
    let app = appMock(undefinedParam);
    let cut = new ElasticsearchWrapper(app);
    //WHEN
    //THEN

    assert.ok(cut.isDisabled(), 'ElasticSearch should be disabled');
    done();

  });

  it('should enable elastic search by config', function(done) {

    //GIVEN: app configuration with enabled elasticsearch
    let app = appMock(true);
    let cut = new ElasticsearchWrapper(app);
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
    let cut = new ElasticsearchWrapper();

    let contribution = {};

    cut.delete(contribution);

    done();
  });

  it('should delete a contribution', function(done) {

    //GIVEN
    let app = appMock(true);
    let cut = new ElasticsearchWrapper(app);
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


  class ESMock {
    constructor() {
      this.deleteParam = '';
    }

    delete(param) {
      logger.debug('ESMock.delete:' + JSON.stringify(param));
      this.deleteParam = param;
      return 0;
    }

    getDeleteParam() {
      return this.deleteParam;
    }
  }

  let esClientMock = function() {
    return {
      function(param) {
        logger.debug('DELETE call at mock detected:' + param);
      }
    };
  };

  let appMock = function(enableES) {

    let app = {
      get: function(param) {
        //logger.info("param:" + param);
        if ('elasticsearch' === param) {
          return {
            enable: enableES
          };
        }
      }
    };
    return app;
  };

});



