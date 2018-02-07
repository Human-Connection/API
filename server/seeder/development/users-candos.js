const seedHelpers = require('../../helper/seed-helpers');

module.exports = (seederstore) => {
  let filter = ({type}) => type === 'cando';

  return {
    services: [{
      count: 80,
      path: 'users-candos',
      templates: [
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          contributionId: () => seedHelpers.randomItem(seederstore.contributions, filter)._id,
          done: true,
          doneAt: '{{date.recent}}',
          createdAt: '{{date.recent}}',
          updatedAt: '{{date.recent}}',
          wasSeeded: true
        },
        {
          userId: () => seedHelpers.randomItem(seederstore.users)._id,
          contributionId: () => seedHelpers.randomItem(seederstore.contributions, filter)._id,
          done: false,
          createdAt: '{{date.recent}}',
          updatedAt: '{{date.recent}}',
          wasSeeded: true
        }
      ]
    }]
  };
};