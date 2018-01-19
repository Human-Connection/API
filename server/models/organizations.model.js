// organizations-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const organizations = new Schema({
    name: { type: String, required: true },
    slug: { type: String },
    followerIds: [],
    categoryIds: { type: Array },
    logo: { type: String },
    userId: { type: String, required: true },
    description: { type: String, required: true },
    addresses: { type: Array, default: [] },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    wasSeeded: { type: Boolean }
  });

  return mongooseClient.model('organizations', organizations);
};
