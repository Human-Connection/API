//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-create

const logger = require('winston');
const assert = require('assert');
const ElasticsearchWrapper = require('../../server/services/search/elasticsearch.wrapper');



describe('ElasticsearchWrapper.find', () => {

  it('should drop, add, find and delete', function (done) {
    let cut = new ElasticsearchWrapper();

    let item = {
      title: 'foxy',
      content: 'a content 123',
      user: 'user_123'
    };

    function drop() {
      logger.info('step 1 drop test');
      return cut.dropIndex();
    }

    function add() {
      logger.info('step 2 add test');
      return cut.add(item);
    }

    function waitForIndexing() {
      logger.info('step 3 Wait for indexing ....');
      return new Promise(function (resolve) {
        setTimeout(resolve, 2000);
      });
    }

    function find() {
      logger.info('step 4 find test');
      let searchQuery = {
        query: {
          token: 'fox'
        }
      };
      cut.find(searchQuery);
    }

    function close(client){
      logger.info('step 5');
      return new Promise(function(resolve){
        logger.info('resolve:' + resolve);
        client.close(client);
      });
    }

    Promise.resolve()
      .then(drop)
      .then(add)
      .then(waitForIndexing)
      .then(find)
      .then(close)
      .then(done());
  });


  it.skip('should drop index', function (done) {

    let cut = new ElasticsearchWrapper();

    cut.dropIndex().then(function (response) {
      let jsonResponse = JSON.stringify(response);
      logger.info('response:' + jsonResponse);
      assert.equal(true, response.acknowledged);
      done();
    }, function (onRejected) {
      logger.info('error:' + JSON.stringify(onRejected));
      done(onRejected);
    });

  });

  it.skip('find some predefined contribution items', function (done) {

    //CUT stands for class-under-test
    let cut = new ElasticsearchWrapper();
    //GIVEN: a search request
    let searchQuery = {
      query: {
        token: 'bird'
      }
    };

    //WHEN
    cut.find(searchQuery)
      .then((response) => {
        logger.info('response:' + JSON.stringify(response));

        //THEN
        assert.equal(response.hits.total, 2, 'but was: ' + response.hits.total);
        done();
      })
      .catch((error) => {
        logger.info('error:' + JSON.stringify(error));
        done(error);
      });
  });


  it.skip('should insert a contribution', function (done) {
    let cut = new ElasticsearchWrapper();
    let item = {
      title: 'fox',
      content: 'a content 123',
      user: 'user_123'
    };

    cut.insert(item, (response) => {
      logger.info('insert response:' + JSON.stringify(response));
      assert.equal('created', response.result, 'but was:' + response.result);
      done();
    }, (error) => {
      if (error) {
        done(error);
      }
    });

  });
});


