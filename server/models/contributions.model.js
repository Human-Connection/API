// contributions-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');

  const candoSchema = mongooseClient.Schema({
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    reasonTitle: { type: String },
    reason: { type: String }
  });

  const metaSchema = mongooseClient.Schema({
    hasVideo: {
      type: Boolean,
      default: false
    },
    embedds: {
      type: Object,
      default: {}
    }
  });

  const contributions = new mongooseClient.Schema({
    userId: { type: String, required: true },
    categoryIds: { type: Array },
    title: { type: String, required: true },
    // Generated from title
    slug: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    cando: candoSchema,
    content: { type: String, required: true },
    // Generated from content
    contentExcerpt: { type: String, required: true },
    teaserImg: { type: String },
    language: { type: String, required: true },
    shoutCount: { type: Number, default: 0 },
    meta: metaSchema,
    visibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    isEnabled: {
      type: Boolean,
      default: true
    },
    tags: { type: Array },
    emotions: {
      type: Object,
      default: {
        angry: {
          count: 0,
          percent: 0
        },
        cry: {
          count: 0,
          percent: 0
        },
        surprised: {
          count: 0,
          percent: 0
        },
        happy: {
          count: 0,
          percent: 0
        },
        funny: {
          count: 0,
          percent: 0
        }
      }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    wasSeeded: { type: Boolean }
  });

  contributions.index({
    title: 'text',
    content: 'text',
    tags: 'text',
  }, {
    name: 'contributions_full_text',
    default_language: 'en',
    weights: {
      title: 3,
      tags: 2,
      content: 1
    }
  });
  // contributions.index({ title: 1, content: 2 });

  return mongooseClient.model('contributions', contributions);
};
