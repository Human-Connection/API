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
          language: () => seedHelpers.randomItem(['de', 'en']),
          visibility: 'public',
          createdAt: '{{date.recent}}',
          updatedAt: '{{date.recent}}',
          wasSeeded: true
        },
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          title: '{{lorem.sentence}}',
          type: 'post',
          categoryIds: () => seedHelpers.randomCategories(seederstore),
          content: '{{lorem.text}} {{lorem.text}}',
          language: () => seedHelpers.randomItem(['de', 'en']),
          visibility: 'public',
          createdAt: '{{date.recent}}',
          updatedAt: '{{date.recent}}',
          wasSeeded: true
        },
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          title: '{{lorem.sentence}}',
          type: 'post',
          categoryIds: () => seedHelpers.randomCategories(seederstore),
          content: '{{lorem.text}} {{lorem.text}}',
          language: () => seedHelpers.randomItem(['de', 'en']),
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