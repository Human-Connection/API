// Initializes the `uploads` service on path `/uploads`
const hooks = require('./uploads.hooks');
const filters = require('./uploads.filters');

// File Service
// feathers-blob service
const blobService = require('feathers-blob');
// Here we initialize a FileSystem storage,
// but you can use feathers-blob with any other
// storage service like AWS or Google Drive.
const fs = require('fs-blob-store');
const blobStorage = fs(__dirname + '/../../../public/uploads');

// For Multipart Uploads
const multer = require('multer');
const multipartMiddleware = multer();

module.exports = function () {
  const app = this;

  const options = {
    name: 'uploads',
    Model: blobStorage
  };

  // Initialize our service with any options it requires
  app.use('/uploads',
    // multer parses the file named 'file'.
    // Without extra params the data is
    // temporary kept in memory
    multipartMiddleware.single('file'),

    // another middleware, this time to
    // transfer the received file to feathers
    function(req,res,next){
      req.feathers.file = req.file;
      next();
    },
    blobService(options)
  );

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('uploads');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
