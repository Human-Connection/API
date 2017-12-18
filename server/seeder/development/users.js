
// eslint-disable-next-line no-unused-vars
module.exports = (seederstore) => {
  return {
    services: [{
      path: 'users',
      count: 50,
      template: {
        email: '{{internet.email}}',
        password: '{{internet.password}}',
        name: '{{name.firstName}} {{name.lastName}}',
        slug: '{{lorem.slug}}',
        isnothere: true,
        timezone: 'Europe/Berlin',
        avatar: '{{internet.avatar}}',
        isVerified : true,
        role : 'user',
        doiToken: null,
        confirmedAt: null,
        deletedAt: null,
        wasSeeded: true
      }
    }]
  };
};