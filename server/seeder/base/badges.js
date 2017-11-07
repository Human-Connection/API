const _ = require('lodash');
const randomItem = require('../../helper/seed-helpers')().randomItem;

module.exports = (seederstore) => {
  return {
    services: [{
      path: 'badges',
      count: 1,
      template: {
        image: {
          path: 'https://cdn.frontify.com/api/screen/thumbnail/XX9MuecGg2sy_CuMKs6FulhegxuoRIqi-7nhTI65O6DOzyS6YQc2s5XIQJgeScEJjTq8puwTMSRzlVkpWRnP3A/1524',
          alt: '{{lorem.word}}',
        },
        text: '{{lorem.word}}',
          status: 'permanent',
        type: '{{lorem.word}}'
      }
    }]
  };
};