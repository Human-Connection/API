// contributions-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const contributions = new mongooseClient.Schema({
    userId: { type: String, required: true },
    categoryIds: { type: Array },
    title: { type: String, required: true },
    // Generated from title
    slug: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    // Generated from content
    contentExcerpt: { type: String, required: true },
    teaserImg: { type: String },
    language: { type: String, required: true },
    visibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    emotions: {
      type: Object,
      default: {
        angry: 0,
        cry: 0,
        surprised: 0,
        happy: 0,
        funny: 0
      }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('contributions', contributions);
};
