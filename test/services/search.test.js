//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-create

const logger = require('winston');
const assert = require('assert');
//const app = require('../../server/app');

const elasticsearch = require('elasticsearch');

const SearchES = require('../../server/services/search/SearchES');


runAddContribution = (cut, done) => {
  //WHEN
  cut.addContribution(title, content, contributionId, userId, date,
    function (error) {
      console.log('addContribution responseJson:' + responseJson);
      done();
    },
    function (response) {

      //THEN
      responseJson = JSON.stringify(response);
      console.log('addContribution responseJson:' + responseJson);
      done();
    }

  );
};

describe('search service', () => {

  it('should add a contribution', function (done) {

    //GIVEN
    cut = new SearchES();

    title = 'A contribution title 200';
    content = 'A story text 200';
    contributionId = 'contr_id_200';
    userId = 'user_id_200';
    date = Date.now;

    cut.removeContribution(contributionId, function (error) {
      //console.log('removeContribution error:' + JSON.stringify(error));
    },
    function (response) {
      console.log('removeContribution response:' + JSON.stringify(response));
      
      runAddContribution(cut, done);

    }
    );

  });

  it('should find contributions via service', function (done) {

    cut = new SearchES();

    //TODO RB:
    //
    // + expect 2 items
    // + load test data before this test is executed
    // currently, search.testdata.sh has to be run before

    cut.findContribution('fox', function (response) {
      let numberOfHits = response.hits.total;
      assert.equal(numberOfHits, 1);
      done();
    });
  });

  it.skip('should find contributions by title and content', function (done) {

    let client = new elasticsearch.Client({
      host: 'localhost:9200',
      apiVersion: '5.5'
    });

    console.log('start test...');
    client.search({
      index: 'hc',
      type: 'contribution',
      body: {
        query: {
          bool: {
            should: {
              term: { title: 'fox' }
            },
            should: {
              term: { content: 'fox' }
            }
          }

        }
      }
    }, function (error, response) {
      console.log('error:', JSON.stringify(error));
      console.log('result:', JSON.stringify(response));

      let numberOfHits = response.hits.total;
      assert.equal(numberOfHits, 2);

      done();
    });
  });


  it.skip('should find contributions by title and content, with testdata loaded', function (done) {

    let client = new elasticsearch.Client({
      host: 'localhost:9200',
      apiVersion: '5.5'
    });



    clearTestData(client, (client) => {
      loadTestData1(client, (client) => {
        loadTestData2(client, (client) => {
          console.log('start test...');
          client.search({
            index: 'hc',
            type: 'contribution',
            body: {
              query: {
                bool: {
                  should: {
                    term: { title: 'fox' }
                  },
                  should: {
                    term: { content: 'fox' }
                  }
                }

              }
            }
          }, function (error, response) {
            console.log('error:', JSON.stringify(error));
            console.log('response:', JSON.stringify(response));

            let numberOfHits = response.hits.total;
            assert.equal(numberOfHits, 2);


            done();
          });
        });
      });
    });
  });




});
//-----------------

clearTestData = (client, callback) => {
  client.delete({
    index: 'hc'
  }, function (error, response) {
    console.log('delete error:', JSON.stringify(error));
    console.log('delete response:', JSON.stringify(response));
    callback(client);
  });
};

loadTestData1 = (client, callback) => {
  client.create({
    index: 'hc',
    type: 'contribution',
    id: '10',
    body: {
      title: 'A brown fox',
      content: 'A quick brown fox jumped over the fence.',
      published_at: '2013-01-01'
    }
  }, function (error, response) {
    console.log('response1:' + JSON.stringify(response));
    callback(client);
  });
};

loadTestData2 = (client, callback) => {
  client.create({
    index: 'hc',
    type: 'contribution',
    id: '20',
    body: {
      title: 'A red cat',
      content: 'A quick red fox jumped over the fence.',
      published_at: '2013-01-01'
    }
  }, function (error, response) {
    console.log('response2:' + JSON.stringify(response));
    callback(client);
  });
};
