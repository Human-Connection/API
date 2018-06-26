// organizations-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const followsSchema = mongooseClient.Schema({
    users: { type: Number, default: 0 },
    organizations: { type: Number, default: 0 },
    projects: { type: Number, default: 0 }
  }, { minimize: false });
  const addressSchema = mongooseClient.Schema({
    street: { type: String, required: true },
    zipCode: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    primary: { type: Boolean, default: false }
  });
  const channel = mongooseClient.Schema({
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['telegram', 'yahoo', 'skype', 'meetup', 'twitter', 'medium'],
      required: true
    }
  });
  const organizations = new Schema({
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    followersCounts: followsSchema,
    followingCounts: followsSchema,
    categoryIds: { type: Array, required: true, index: true },
    logo: { type: String },
    coverImg: { type: String },
    creatorId: { type: String, required: true },
    ownerIds: { type: [String], default: [] },
    userIds: { type: [String], default: [] },
    description: { type: String, required: true },
    descriptionExcerpt: { type: String }, // will be generated automatically
    phone: { type: String },
    publicEmail: { type: String },
    url: { type: String },
    type: {
      type: String,
      index: true,
      enum: ['ngo', 'npo', 'goodpurpose', 'ev', 'eva', 'other']
    },
    language: { type: String, required: true, default: 'de', index: true },
    addresses: { type: [addressSchema], default: [] },
    channels: { type: [channel], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isEnabled: {
      type: Boolean,
      default: false,
      index: true
    },
    reviewedBy: { type: String, default: null, index: true },
    tags: { type: Array, index: true },
    deleted: {
      type: Boolean,
      default: false,
      index: true
    },
    wasSeeded: { type: Boolean }
  });

  return mongooseClient.model('organizations', organizations);
};
