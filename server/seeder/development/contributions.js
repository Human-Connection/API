const _ = require('lodash');
const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  return {
    services: [{
      count: 60,
      path: 'contributions',
      templates: [
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          title: '{{lorem.words}}',
          type: 'post',
          categoryIds: () => seedHelpers.randomCategories(seederstore),
          content: '{{lorem.text}} {{lorem.text}}',
          teaserImg: seedHelpers.randomUnsplashUrl,
          language: 'de_DE',
          createdAt: '{{date.recent}}',
          updatedAt: '{{date.recent}}'
        },
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          title: '{{lorem.sentence}}',
          type: 'post',
          categoryIds: () => seedHelpers.randomCategories(seederstore),
          content: '{{lorem.text}} {{lorem.text}}',
          language: 'de_DE',
          createdAt: '{{date.recent}}',
          updatedAt: '{{date.recent}}'
        }
      ]
    }]
  };
};