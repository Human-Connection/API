// Database Seeder Config

// See https://www.npmjs.com/package/feathers-seeder
// Using faker models https://github.com/marak/Faker.js/

// eslint-disable-next-line no-unused-vars
module.exports = (seederstore) => {
  return {
    services: [
      {
        path: 'pages',
        template: {
          title: 'Terms and Condition',
          type: 'termsAndConditions',
          key: 'terms-and-conditions',
          content: '<strong>ADD TERMS AND CONDITIONS!</strong>',
          language: 'en'
        }
      },
      {
        path: 'pages',
        template: {
          title: 'Nutzungsbedingungen',
          type: 'termsAndConditions',
          key: 'terms-and-conditions',
          content: '<strong>FÜGE AGB`s HINZU!</strong>',
          language: 'de'
        }
      },
      {
        path: 'pages',
        template: {
          title: 'Data Privacy',
          type: 'dataPrivacy',
          key: 'privacy',
          content: '<strong>ADD PRIVACY POLICY!</strong>',
          language: 'en'
        }
      },
      {
        path: 'pages',
        template: {
          title: 'Datenschutzerklärung',
          type: 'dataPrivacy',
          key: 'privacy',
          content: '<strong>FÜGE DATENSCHUTZRICHTLINIEN HINZU!</strong>',
          language: 'de'
        }
      },
      {
        path: 'pages',
        template: {
          title: 'Imprint',
          type: 'imprint',
          key: 'imprint',
          content: '<strong>ADD IMPRINT!</strong>',
          language: 'en'
        }
      },
      {
        path: 'pages',
        template: {
          title: 'Impressum',
          type: 'imprint',
          key: 'imprint',
          content: '<strong>FÜGE EIN IMPRESSUM HINZU!</strong>',
          language: 'de'
        }
      }
    ]
  };
};
