// notifications-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const notifications = new mongooseClient.Schema({
    // User this notification is sent to
    userId: { type: String, required: true },
    message: { type: String, required: true },
    relatedContributionId: { type: String },
    relatedCommentId: { type: String },
    unseen: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('notifications', notifications);
};
