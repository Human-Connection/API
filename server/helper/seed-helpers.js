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

module.exports = {
  randomItem: (items) => {
    return items[_.shuffle(_.keys(items)).pop()];
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
  randomCategories: (seederstore) => {
    const count = Math.round(Math.random() * 3);
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
  }
};
