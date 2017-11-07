const _ = require('lodash');
const unsplashTopics = [
  'love',
  'family',
  'spring',
  'business',
  'nature',
  'travel',
  'happy',
  'landscape',
  'health',
  'friends',
  'computer',
  'autumn',
  'space',
  'animal',
  'smile',
  'face',
  'people',
  'portrait',
  'amazing'
];
let unsplashTopicsTmp = [];

module.exports = function() {
  return {
    /**
     * @param items
     */
    randomItem: (items) => {
      return items[_.shuffle(_.keys(items)).pop()];
    },
    randomUnspashUrl: () => {
      if (unsplashTopicsTmp.length < 2) {
        unsplashTopicsTmp = _.shuffle(unsplashTopics);
      }
      return 'https://source.unsplash.com/daily?' + unsplashTopicsTmp.pop() + ',' + unsplashTopicsTmp.pop();
    },
    randomCategories: (seederstore) => {
      const count = Math.round(Math.random() * 3);
      let categorieIds = _.shuffle(_.keys(seederstore.categories));
      let ids = [];
      for (let i = 0; i < count; i++) {
        ids.push(categorieIds.pop());
      }
      return ids;
    }
  };
};
