// system-notifications-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const systemNotifications = new mongooseClient.Schema({
    type: { type: String, default: 'info' },
    title: { type: String },
    content: { type: String },
    slot: { type: String },
    language: { type: String },
    showOnce: { type: Boolean, default: true },
    requireConfirmation: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    totalCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    wasSeeded: { type: Boolean }
  });

  return mongooseClient.model('systemNotifications', systemNotifications);
};
