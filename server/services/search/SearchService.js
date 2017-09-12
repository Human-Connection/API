'use strict';

const logger = require('winston');
// const _ = require('lodash');

class SearchService {
  constructor() {

  }

  setApp(app) {
    this.app = app;
  }

  findUserByName(namePattern) {
    //see: https://stackoverflow.com/questions/28583642/using-regex-mongodb-query-in-node-js-not-working
    //{$regex: /.*abc./, $options:"i"}
    var regexValue = '.*' + namePattern + '.'; //eslint-ignore
    let findQuery = { name: new RegExp(regexValue, 'i') };
    logger.info('findQuery:' + findQuery);

    const userService = this.app.service('users');

    return userService.find({ query: findQuery });

  }

  findUsers(token) {
    logger.info('search token:' + token);
    const namePattern = token.query.name;
    //logger.info("TODO: search for users with name="+namePattern);
    return this.findUserByName(namePattern);
  }

  findContributionsByTitle(params) {
    const pattern = params.query.title;

    var regexValue = '.*' + pattern + '.';

    let findQuery = { title: new RegExp(regexValue, 'i') };

    logger.info('findContributionsByTitle, findQuery:' + findQuery);

    const service = this.app.service('contributions');

    return service.find({ query: findQuery });

  }

  findContributionsByContent(params) {
    const pattern = params.query.content;

    var regexValue = '.*' + pattern + '.';

    let findQuery = { content: new RegExp(regexValue, 'i') };

    logger.info('findContributionsByContent, findQuery:' + findQuery);

    const service = this.app.service('contributions');

    return service.find({ query: findQuery });

  }

  findContributionsByContentOrTitle(params) {
    const pattern = params.query.contentOrTitle;

    var regexValue = '.*' + pattern + '.';

    let findQuery = {  content: 
                            new RegExp(regexValue, 'i'), 
    title: 
                            new RegExp(regexValue, 'i')  
                        
    };

    logger.info('findContributionsByContent, findQuery:' + findQuery);

    const service = this.app.service('contributions');

    return service.find({ query: findQuery });

  }


  find(params) {
    logger.info('SearchService.find');
    if (params.query.title) {
      return Promise.resolve(
        //this.findUsers(params)
        this.findContributionsByTitle(params)
      );
    }
    else if (params.query.content) {
      return Promise.resolve(
        //this.findUsers(params)
        this.findContributionsByContent(params)
      );
    } 
    else if (params.query.contentOrTitle) {
      return Promise.resolve(
        //this.findUsers(params)
        this.findContributionsByContentOrTitle(params)
      );
    } 

  }

  
  
}

module.exports = SearchService;
