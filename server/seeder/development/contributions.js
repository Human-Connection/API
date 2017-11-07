const _ = require('lodash');
const randomItem = require('../../helper/seed-helpers')().randomItem;
const randomUnsplashUrl = require('../../helper/seed-helpers')().randomUnspashUrl;
const randomCategories = require('../../helper/seed-helpers')().randomCategories;

module.exports = (seederstore) => {
  return {
    services: [{
      count: 60,
      path: 'contributions',
      templates: [
        {
          userId: () => randomItem(seederstore.users)._id,
          title: '{{lorem.words}}',
          type: 'post',
          categoryIds: () => randomCategories(seederstore),
          content: '{{lorem.text}} {{lorem.text}}',
          teaserImg: randomUnsplashUrl,
          language: 'de_DE',
          createdAt: '{{date.recent}}',
          updatedAt: '{{date.recent}}'
        },
        {
          userId: () => randomItem(seederstore.users)._id,
          title: '{{lorem.sentence}}',
          type: 'post',
          categoryIds: () => randomCategories(seederstore),
          content: '{{lorem.text}} {{lorem.text}}',
          language: 'de_DE',
          createdAt: '{{date.recent}}',
          updatedAt: '{{date.recent}}'
        }
      ]
    }]
  };
};