const seedHelpers = require('../../helper/seed-helpers');
const { size } = require('lodash');

module.exports = (seederstore) => {
  return {
    services: [{
      count: 30,
      path: 'contributions',
      templates: [
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          title: '{{lorem.words}}',
          type: 'cando',
          categoryIds: () => seedHelpers.randomCategories(seederstore),
          cando: {
            difficulty: () => seedHelpers.randomDifficulty(),
            reasonTitle: '{{lorem.words}}?',
            reason: '{{lorem.text}} {{lorem.text}}'
          },
          content: '{{lorem.text}} {{lorem.text}}',
          teaserImg: seedHelpers.randomUnsplashUrl,
          language: () => seedHelpers.randomItem(['de', 'en']),
          shouts: () => seedHelpers.randomItems(seederstore.users, '_id', 0, Math.floor(size(seederstore.users) / 2)),
          visibility: 'public',
          createdAt: '{{date.recent}}',
          updatedAt: '{{date.recent}}',
          wasSeeded: true
        },
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          title: '{{lorem.sentence}}',
          type: 'cando',
          categoryIds: () => seedHelpers.randomCategories(seederstore),
          cando: {
            difficulty: () => seedHelpers.randomDifficulty(),
            reasonTitle: '{{lorem.words}}?',
            reason: '{{lorem.text}} {{lorem.text}}'
          },
          content: '{{lorem.text}} {{lorem.text}}',
          language: () => seedHelpers.randomItem(['de', 'en']),
          shouts: () => seedHelpers.randomItems(seederstore.users, '_id', 0, Math.floor(size(seederstore.users) / 2)),
          visibility: 'public',
          createdAt: '{{date.recent}}',
          updatedAt: '{{date.recent}}',
          wasSeeded: true
        },
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          title: '{{lorem.sentence}}',
          type: 'cando',
          categoryIds: () => seedHelpers.randomCategories(seederstore),
          cando: {
            difficulty: () => seedHelpers.randomDifficulty(),
            reasonTitle: '{{lorem.words}}?',
            reason: '{{lorem.text}} {{lorem.text}}'
          },
          content: '{{lorem.text}} {{lorem.text}}',
          language: () => seedHelpers.randomItem(['de', 'en']),
          shouts: () => seedHelpers.randomItems(seederstore.users, '_id', 0, Math.floor(size(seederstore.users) / 2)),
          visibility: 'public',
          isEnabled: false,
          createdAt: '{{date.recent}}',
          updatedAt: '{{date.recent}}',
          wasSeeded: true
        }
      ]
    }]
  };
};