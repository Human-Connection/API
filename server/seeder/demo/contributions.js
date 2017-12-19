const seedHelpers = require('../../helper/seed-helpers');
const fs = require('fs');
const { isEmpty, size } = require('lodash');

module.exports = (seederstore) => {

  if (isEmpty(seederstore)) {
    throw new Error('Seederstore has to be filled for seeding contributions');
  }
  const data = JSON.parse(fs.readFileSync(__dirname + '/data/en_contributions.json', 'utf8'));

  let templates = [];
  data.forEach(entry => {
    templates.push({
      userId: () => seedHelpers.randomItem(seederstore.users)._id,
      title: entry.title,
      type: entry.type || 'post',
      categoryIds: () => {
        if (!isEmpty(entry.categorySlugs)) {
          return seedHelpers.mapIdsByKey(seederstore.categories, entry.categorySlugs, 'slug');
        } else {
          return seedHelpers.randomCategories(seederstore, false);
        }
      },
      content: entry.content,
      tags: entry.tags || [],
      teaserImg: () => entry.teaserImg || seedHelpers.randomUnsplashUrl,
      language: entry.language,
      shouts: () => seedHelpers.randomItems(seederstore.users, '_id', 0, Math.floor(size(seederstore.users) / 2)),
      visibility: 'public',
      createdAt: '{{date.recent}}',
      updatedAt: '{{date.recent}}',
      wasSeeded: true
    });
  });

  return {
    services: [{
      randomize: false,
      path: 'contributions',
      templates: templates
    }]
  };
};