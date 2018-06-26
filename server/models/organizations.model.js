// organizations-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const hcModules = require('human-connection-modules');
const channelNames = hcModules.collections.socialChannels.names;
const organizationTypes = hcModules.collections.organizationTypes.names;

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
  const channelSchema = mongooseClient.Schema({
    name: { type: String, required: true },
    type: {
      type: String,
      enum: channelNames,
      required: true
    }
  });
  const userSchema = mongooseClient.Schema({
    id: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'editor'],
      default: 'editor'
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
    users: { type: [userSchema], default: [] },
    description: { type: String, required: true },
    descriptionExcerpt: { type: String }, // will be generated automatically
    phone: { type: String },
    email: { type: String },
    url: { type: String },
    type: {
      type: String,
      index: true,
      enum: organizationTypes
    },
    language: { type: String, required: true, default: 'de', index: true },
    addresses: { type: [addressSchema], default: [] },
    channels: { type: [channelSchema], default: [] },
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
