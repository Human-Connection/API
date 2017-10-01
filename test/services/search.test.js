//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-create

const logger = require('winston');
const assert = require('assert');
//const app = require('../../server/app');

const elasticsearch = require('elasticsearch');

const SearchES = require('../../server/services/search/SearchES');



describe('search service version 2', () => {
  it('insert and find test', function (done) {
    cut = new SearchES();

    // test data
    let date = new Date();
    console.log('now:' + date);
    title = 'A contribution title 300_' + date;
    content = 'A story text 300_' + date;
    contributionId = 'contr_id_300_' + date;
    userId = 'user_id_300';


    cut.addContribution(title, content, contributionId, userId, date)
      .then(value => {
        //THEN
        responseJson = JSON.stringify(value);
        console.log('test insert response:' + responseJson);

        cut.findAll(function (response) {
          console.log('\ntest findAll.response:' + JSON.stringify(response));

          cut.findContribution('fox', function (response) {
            console.log('\nsearch.test: response:' + JSON.stringify(response));
            let numberOfHits = response.hits.total;
            //THEN
            assert.equal(numberOfHits, 1);
            done();
          });

        });




      })
      .catch(error => {
        console.log('insert error:' + error);
        done(error);
      });

  });
});

describe.skip('search service', () => {


  it('should add a contribution', function (done) {

    //GIVEN
    cut = new SearchES();

    title = 'A contribution title 300';
    content = 'A story text 300';
    contributionId = 'contr_id_300';
    userId = 'user_id_300';
    date = Date.now;

    function runTest() {

    }
    cut.removeContribution(contributionId)
      .then(value => {
        console.log('removeContribution response:' + JSON.stringify(value));
        cut.addContribution(title, content, contributionId, userId, date)
          .then(value => {
            //THEN
            responseJson = JSON.stringify(value);
            console.log('addContribution responseJson:' + responseJson);
            done();
          })
          .catch(error => {
            console.log('addContribution responseJson:' + error);
            done(error);
          });
      })
      .catch(error => {
        console.log('removeContribution error:' + JSON.stringify(error));
        cut.addContribution(title, content, contributionId, userId, date)
          .then(value => {
            //THEN
            responseJson = JSON.stringify(value);
            console.log('addContribution responseJson:' + responseJson);
            done();
          })
          .catch(error => {
            console.log('addContribution responseJson:' + error);
            done(error);
          });
      });


  });

  it('should find contributions via service', function (done) {

    cut = new SearchES();

    title = 'A contribution title 400';
    content = 'A story text 400';
    contributionId = 'contr_id_400';
    userId = 'user_id_400';
    date = Date.now;
    //GIVEN  a contribution
    cut.addContribution(title, content, contributionId, userId, date)
      .then(value => {
        console.log('search.test: add contribution: ' + JSON.stringify(value));

        //WHEN
        cut.findContribution('story', function (response) {
          console.log('search.test: response:' + JSON.stringify(response));
          let numberOfHits = response.hits.total;
          //THEN
          assert.equal(numberOfHits, 1);
          done();
        });
      })
      .catch(error => {
        console.log('should find contributions via service error :' + error);
        done(error);
      });

  });


  it.skip('should find contributions by title and content', function (done) {

    cut = new SearchES();

    title = 'A contribution title 400';
    content = 'A story text 400';
    contributionId = 'contr_id_400';
    userId = 'user_id_400';
    date = Date.now;
    //GIVEN  a contribution
    cut.addContribution(title, content, contributionId, userId, date)
      .then(value => {
        //WHEN
        cut.findContribution('story', function (response) {
          let numberOfHits = response.hits.total;
          //THEN
          assert.equal(numberOfHits, 1);
          done();
        });

      })
      .catch(error => {
        console.log('addContribution error :' + error);
        done(error);
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
