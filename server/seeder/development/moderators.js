
// eslint-disable-next-line no-unused-vars
module.exports = (seederstore) => {
  return {
    services: [{
      path: 'users',
      count: 1,
      template: {
        email: 'test3@test3.de',
        password: '1234',
        name: 'Mike Moderator',
        isnothere: true,
        timezone: 'Europe/Berlin',
        avatar: '{{internet.avatar}}',
        isVerified : true,
        role : 'moderator',
        doiToken: null,
        confirmedAt: null,
        deletedAt: null,
        wasSeeded: true
      }
    }]
  };
};