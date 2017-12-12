//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-create

const logger = require('winston');
const assert = require('assert');
const ElasticsearchWrapper = require('../../server/services/search/elasticsearch.wrapper');
const { appMock } = require('../../test/services/search/esTestHelper');

describe('ElasticSearchWrapper.findByPattern', () => {
  it('should find contributions by title, content, category', function (done) {

    const cut = new ElasticsearchWrapper(appMock(true));

    const params = {
      query: {
        $skip: 0,
        $sort: {
          createdAt: -1
        },
        $search: "dolo"
      }
    };

    //WHEN
    const searchResult = cut.find(params);
    //THEN
    searchResult.then(function (response) {
      
      const responseJson = JSON.stringify(response);
      logger.info("response message: " + responseJson);

      logger.info("first value: " + response.total);

      const numberOfHist = 0;
      
      done();
      
    });



  }
  );
});

describe.skip('ElasticsearchWrapper.update', () => {

  it('should add and update a contribution', function (done) {
    let cut = new ElasticsearchWrapper(appMock(true));
    cut.setESIndex('hc2');
    let date = new Date();

    let salt = date.toUTCString();

    let NEW_ID = 'id12345_' + salt;
    let contribution = {
      _id: NEW_ID,
      title: 'Title3',
      content: 'a content text 123'
    };

    logger.info('adding contribution:' + JSON.stringify(contribution));

    let addResult = cut.add(contribution);

    addResult.then(function (value) {
      logger.info('step 1 - add new contribution 1 result: ' + JSON.stringify(value));

      let addResult2 = cut.add(contribution);

      addResult2.then(function (value) {
        logger.info('step 2 - add new contribution 2 result: ' + JSON.stringify(value));

        assert.equal(value._id, NEW_ID);

        done();

      });

    });

  });
});



