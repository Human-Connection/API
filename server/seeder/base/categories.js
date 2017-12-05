// Database Seeder Config

// See https://www.npmjs.com/package/feathers-seeder
// Using faker models https://github.com/marak/Faker.js/

// eslint-disable-next-line no-unused-vars
module.exports = (seederstore) => {
  return {
    services: [
      {
        path: 'categories',
        template: {
          slug: 'justforfun',
          title: 'Just For Fun',
          icon: 'categories-justforfun'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'happyness-values',
          title: 'Happyness & Values',
          icon: 'categories-luck'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'health-wellbeing',
          title: 'Health & Wellbeing',
          icon: 'categories-health'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'environment-nature',
          title: 'Environment & Nature',
          icon: 'categories-environment'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'animalprotection',
          title: 'Animal Protection',
          icon: 'categories-animal-justice'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'humanrights-justice',
          title: 'Humanrights Justice',
          icon: 'categories-human-rights'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'education-sciences',
          title: 'Education & Sciences',
          icon: 'categories-education'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'cooperation-development',
          title: 'Cooperation & Development',
          icon: 'categories-cooperation'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'democracy-politics',
          title: 'Democracy & Politics',
          icon: 'categories-politics'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'economy-finances',
          title: 'Economy & Finances',
          icon: 'categories-economy'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'energy-technology',
          title: 'Energy & Technology',
          icon: 'categories-technology'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'it-internet-dataprivacy',
          title: 'IT, Internet & Data Privacy',
          icon: 'categories-internet'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'art-culture-sport',
          title: 'Art, Curlure & Sport',
          icon: 'categories-art'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'freedomofspeech',
          title: 'Freedom of Speech',
          icon: 'categories-freedom-of-speech'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'consumption-sustainability',
          title: 'Consumption & Sustainability',
          icon: 'categories-sustainability'
        }
      },
      {
        path: 'categories',
        template: {
          slug: 'globalpeace-nonviolence',
          title: 'Global Peace & Nonviolence',
          icon: 'categories-peace'
        }
      }
    ]
  };
};
