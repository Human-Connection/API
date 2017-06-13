const posts = require('./posts/posts.service.js');
const users = require('./users/users.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(posts);
  app.configure(users);
};
