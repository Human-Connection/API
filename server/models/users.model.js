// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const followsSchema = mongooseClient.Schema({
    type: String,
    id: String
  });
  const users = new mongooseClient.Schema({
    email: {type: String, required: true, unique: true},
    password: { type: String },
    name: { type: String },
    slug: { type: String },
    gender: { type: String },
    followerIds: [],
    follows: [followsSchema],
    isnothere: { type: Boolean },
    timezone: { type: String },
    avatar: { type: String },
    coverImg: { type: String },
    doiToken: { type: String },
    confirmedAt: { type: Date },
    badgeIds: [],
    deletedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastActiveAt: { type: Date, default: Date.now },
    // Needed for verification
    isVerified: { type: Boolean },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'manager', 'editor', 'user'],
      default: 'user'
    },
    verifyToken: { type: String },
    verifyShortToken: { type: String },
    verifyExpires: { type: Date },
    verifyChanges: { type: Object },
    resetToken: { type: String },
    resetShortToken: { type: String },
    resetExpires: { type: Date },
    wasSeeded: { type: Boolean },
    wasInvited: { type: Boolean },
    language: { type: String, default: 'en' }
  });

  users.index({
    name: 'text'
  });

  return mongooseClient.model('users', users);
};
