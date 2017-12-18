// comments-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const comments = new mongooseClient.Schema({
    userId: { type: String, required: true },
    contributionId: { type: String, required: true },
    content: { type: String, required: true },
    // Generated from content
    contentExcerpt: { type: String, required: true },
    upvotes: { type: Array, default: [] },
    upvoteCount: { type: Number, default: 0 },
    language: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    wasSeeded: { type: Boolean }
  });

  return mongooseClient.model('comments', comments);
};
