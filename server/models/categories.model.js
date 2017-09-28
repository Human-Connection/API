// categories-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const categories = new mongooseClient.Schema({
    title: { type: String, required: true },
    // Generated from title
    slug: { type: String, required: true, unique: true },
    icon: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('categories', categories);
};
