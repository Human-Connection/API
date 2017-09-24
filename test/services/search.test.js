//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-create


const assert = require('assert');
//const app = require('../../server/app');

const elasticsearch = require('elasticsearch');



describe('search service', () => {

  it('should find contributions by title and content', function (done) {

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
