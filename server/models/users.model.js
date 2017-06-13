// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const users = new mongooseClient.Schema({
  
    email: {type: String, unique: true},
    password: { type: String },
    username: { type: String },
    slug: { type: String },
    gender: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    timezone: { type: String },
    avatar: {
      large: { type: String },
      small: { type: String },
      medium: { type: String }
    },
    doiToken: { type: String },
    confirmedAt: { type: Date },
    deletedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('users', users);
};
