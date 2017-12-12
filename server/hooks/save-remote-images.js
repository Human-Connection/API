// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const errors = require('feathers-errors');
const fs = require('fs');
const path = require('path');
const request = require('request');
const faker = require('faker');

module.exports = function (options = []) { // eslint-disable-line no-unused-vars
  return function async (hook) {

    return new Promise((resolve) => {
      let urls = [];

      try {
        let uploadDir = path.resolve('public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }

        const uploadsUrl = hook.app.get('uploads');

        let loading = 0;
        let imgCount = 0;

        // save all given fields and update the hook data
        options.forEach((field) => {
          if (!hook.data[field] || hook.data[field].search(uploadsUrl) >= 0) {
            // skip invalid and local data
            return;
          }
          loading++;
          imgCount++;
          // TODO: fix that to use the data _id or somethink similar
          let uuid = faker.fake('{{random.uuid}}');
          const imgName = `${field}_${uuid}.jpg`;
          const imgPath = path.resolve('public', 'uploads/' + imgName);
          let stream = fs.createWriteStream(imgPath);
          urls.push(imgPath);
          stream.on('close', () => {
            if (--loading <= 0) {
              hook.app.debug('Download(s) finished', imgName);
              resolve(hook);
            } else {
              hook.app.debug('Download finished', imgName);
            }
          });
          stream.on('error', (err) => {
            // reject(err);
            throw new errors.Unprocessable('Thumbnail download failed', { errors: err, urls: urls });
          });
          hook.app.debug('Downloading', hook.data[field]);
          request(hook.data[field]).pipe(stream);
          hook.data[field] = uploadsUrl + imgName;
        });

        if (imgCount > 0 && loading <= 0) {
          hook.app.debug('Download(s) finished', urls);
          resolve(hook);
        } else if (!imgCount) {
          resolve(hook);
        }
      } catch(err) {
        // reject(err);
        throw new errors.Unprocessable('Thumbnail download failed', { errors: err, urls: urls });
      }
    });
  };
};
