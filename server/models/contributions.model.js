// contributions-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const contributions = new mongooseClient.Schema({
    userId: { type: String, required: true },
    // categoryId: { type: String, required: true },
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('contributions', contributions);
};
