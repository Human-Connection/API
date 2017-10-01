//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-create

const logger = require('winston');
const assert = require('assert');
const ElasticsearchWrapper = require('../../server/services/search/elasticsearch.wrapper');



describe('ElasticsearchWrapper.find', () => {
  it('find some predefined contribution items', function (done) {

    //CUT stands for class-under-test
    cut = new ElasticsearchWrapper();
    //GIVEN: a search request
    let searchQuery = {
      query : {
        token: 'bird'
      }
    };
    
    //WHEN
    cut.find(searchQuery)
      .then( (response)=>{
        console.log('response:' + JSON.stringify(response));

        //THEN
        assert.equal(response.hits.total, 2, 'but was: ' + response.hits.total);
        done();
      })
      .catch( (error)=>{
        console.log('error:' + JSON.stringify(error));
        done(error);
      });
  });
});


