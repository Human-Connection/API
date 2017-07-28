// badges-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  // path is the filename and maybe an additional path
  // has to be discussed, maybe we need to switch to filename only
  // or add property filename to the path
  const imageSchema = mongooseClient.Schema({
    path: {type: String, required: true},
    alt: {type: String, required: true}
  })
  const badges = new Schema({
    image: imageSchema,
    text: { type: String, required: true },
    status: { type: String, required: true}, // may be temporary or some other status
    type: {type: String, required: true}, // the type off the badge, e.g.
    // Crowdfounder bade is a one time forever badge
    // some badge are badges got by an achivement
    // some badges given by events or they are a gift form an other user
    // some badges may be temporary like moderator badge
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('badges', badges);
};
