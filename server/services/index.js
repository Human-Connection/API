const authManagement = require('./auth-management/auth-management.service.js');
const users = require('./users/users.service.js');
const contributions = require('./contributions/contributions.service.js');
const comments = require('./comments/comments.service.js');
const notifications = require('./notifications/notifications.service.js');
const emails = require('./emails/emails.service.js');
const uploads = require('./uploads/uploads.service.js');
const images = require('./images/images.service.js');
const ngos = require('./ngos/ngos.service.js');
const projects = require('./projects/projects.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(authManagement);
  app.configure(users);
  app.configure(contributions);
  app.configure(comments);
  app.configure(notifications);
  app.configure(emails);
  app.configure(uploads);
  app.configure(images);
  app.configure(ngos);
  app.configure(projects);
};
