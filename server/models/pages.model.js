// pages-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const pages = new mongooseClient.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true },
    type: { type: String, required: true, default: 'page' },
    key: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String, required: true, index: true },
    active: { type: Boolean, default: true, index: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    wasSeeded: { type: Boolean }
  });

  return mongooseClient.model('pages', pages);
};
