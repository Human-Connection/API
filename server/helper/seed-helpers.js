const _ = require('lodash');
const faker = require('faker');
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

const ngoLogos = [
  'http://www.fetchlogos.com/wp-content/uploads/2015/11/Girl-Scouts-Of-The-Usa-Logo.jpg',
  'http://logos.textgiraffe.com/logos/logo-name/Ngo-designstyle-friday-m.png',
  'http://seeklogo.com/images/N/ngo-logo-BD53A3E024-seeklogo.com.png',
  'https://d13yacurqjgara.cloudfront.net/users/472003/screenshots/2374442/newlogo_1x.png',
  'https://dcassetcdn.com/design_img/10133/25833/25833_303600_10133_image.jpg',
  'http://www.logodesigngenius.com/portfolio/portfolio-logo-design/ngo-logo-design/logo-designs-3.png',
  'https://cdn.tutsplus.com/vector/uploads/legacy/articles/08bad_ngologos/20.jpg',
  'https://cdn.tutsplus.com/vector/uploads/legacy/articles/08bad_ngologos/33.jpg',
  null
];

const difficulties = ['easy', 'medium', 'hard'];

module.exports = {
  randomItem: (items, filter) => {
    let ids = filter
      ? Object.keys(items)
        .filter(id => {
          return filter(items[id]);
        })
      : _.keys(items);
    let randomIds = _.shuffle(ids);
    return items[randomIds.pop()];
  },
  randomItems: (items, key = '_id', min = 1, max = 1) => {
    let randomIds = _.shuffle(_.keys(items));
    let res = [];

    const count = _.random(min, max);

    for (let i = 0; i < count; i++) {
      let r = items[randomIds.pop()][key];
      if (key === '_id') {
        r = r.toString();
      }
      res.push(r);
    }
    return res;
  },
  random: (items) => {
    return _.shuffle(items).pop();
  },
  randomDifficulty: () => {
    return _.shuffle(difficulties).pop();
  },
  randomLogo: () => {
    return _.shuffle(ngoLogos).pop();
  },
  randomUnsplashUrl: () => {
    if (unsplashTopicsTmp.length < 2) {
      unsplashTopicsTmp = _.shuffle(unsplashTopics);
    }
    return 'https://source.unsplash.com/daily?' + unsplashTopicsTmp.pop() + ',' + unsplashTopicsTmp.pop();
  },
  randomCategories: (seederstore, allowEmpty = false) => {
    let count = Math.round(Math.random() * 3);
    if (allowEmpty === false && count === 0) {
      count = 1;
    }
    let categorieIds = _.shuffle(_.keys(seederstore.categories));
    let ids = [];
    for (let i = 0; i < count; i++) {
      ids.push(categorieIds.pop());
    }
    return ids;
  },
  randomAddresses: () => {
    const count = Math.round(Math.random() * 3);
    let addresses = [];
    for (let i = 0; i < count; i++) {
      addresses.push({
        city: faker.address.city(),
        zipCode: faker.address.zipCode(),
        street: faker.address.streetAddress(),
        country: faker.address.country(),
        lat: 54.032726 - (Math.random() * 10),
        lng: 6.558838 + (Math.random() * 10)
      });
    }
    return addresses;
  },
  /**
   * Get array of ids from the given seederstore items after mapping them by the key in the values
   *
   * @param items  items from the seederstore
   * @param values values for which you need the ids
   * @param key    the field key that is represented in the values (slug, name, etc.)
   */
  mapIdsByKey: (items, values, key) => {
    let res = [];
    values.forEach(value => {
      res.push(_.find(items, [key, value])._id.toString());
    });
    return res;
  },
  /**
   * Provide a way to iterate for each element in an array while waiting for async functions to finish
   *
   * @param array
   * @param callback
   * @returns {Promise<void>}
   */
  asyncForEach: async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  },
  genInviteCode: () => {
    const chars = '23456789abcdefghkmnpqrstuvwxyzABCDEFGHJKLMNPRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 8; i++) {
      const n = _.random(0, chars.length-1);
      code += chars.substr(n, 1);
    }
    return code;
  }
};
