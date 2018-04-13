// organizations-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const organizations = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    followerIds: [],
    categoryIds: { type: Array },
    logo: { type: String },
    coverImg: { type: String },
    userId: { type: String, required: true },
    description: { type: String },
    publicEmail: { type: String },
    website: { type: String },
    // will be generated automatically
    descriptionExcerpt: { type: String },
    addresses: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isEnabled: {
      type: Boolean,
      default: false
    },
    wasSeeded: { type: Boolean }
  });

  return mongooseClient.model('organizations', organizations);
};
