//elasticsearch.service.js

const elasticsearch = require('elasticsearch');
const service = require('feathers-elasticsearch');

module.exports = function () {
  const app = this;

  const messageService = service({
    Model: new elasticsearch.Client({
      host: 'localhost:9200',
      apiVersion: '5.5'
    }),
    paginate: {
      default: 10,
      max: 50
    },
    elasticsearch: {
      index: 'contributions'
            
    }

  });

  app.use('/messages', messageService);

  app.service('messages');
};
