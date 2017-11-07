module.exports = (seederstore) => {
  return {
    services: [{
      path: 'users',
      count: 10,
      template: {
        email: '{{internet.email}}',
        password: '{{internet.password}}',
        name: '{{name.firstName}} {{name.lastName}}',
        slug: '{{lorem.slug}}',
        isnothere: true,
        timezone: 'Europe/Berlin',
        avatar: '{{internet.avatar}}',
        doiToken: null,
        confirmedAt: null,
        deletedAt: null
      }
    }]
  };
};