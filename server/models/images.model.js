// images-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const images = new mongooseClient.Schema({
    userId: { type: String, required: true },
    title: { type: String },
    // During image creation, we expect to have
    // file: { type: Imagefile, required: true }
    fileId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('images', images);
};
