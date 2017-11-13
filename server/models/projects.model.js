// projects-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const projects = new Schema({
    name: {type: String, required: true},
    followerIds: [],
    categoryIds: { type: Array },
    userId: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    addresses: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('projects', projects);
};
