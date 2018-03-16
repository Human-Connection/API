// get link metadata
// TODO: add more services and use the metascraper to fill some metadata on the article

// const metascraper = require('metascraper');
// const got = require('got');

module.exports = function () {
  return function (hook) {
    return new Promise(async (resolve, reject) => {

      if (hook.data === undefined) {
        return reject(new Error('No data found for metascraper.'));
      }

      // Check required fields
      if (!hook.data || !hook.data.content) {
        return resolve(hook);
      }

      try {
        // find links
        const youtubeRegex = new RegExp(/(?:(?:https?:)?\/\/)?(?:www\.)?youtu(?:be\.com\/(?:watch\?(?:.*?&(?:amp;)?)*v=|v\/|embed\/)|\.be\/)([\w‌​\-]+)(?:(?:&(?:amp;)?|\?)[\w\?=]*)*/, 'ig'); // eslint-disable-line
        const youtubeLinks = youtubeRegex.exec(hook.data.content);

        // here you could scrape the url for metadata
        // hook.app.debug('#6');
        // const { body: html, url } = await got(youtubeLinks[0]);
        // const metadata = await metascraper({html, url});
        // hook.app.debug('metadata');
        // hook.app.debug(metadata);

        if (youtubeLinks.length >= 2) {
          hook.data.teaserImg = `https://img.youtube.com/vi/${youtubeLinks[1]}/default.jpg`;
          hook.data.meta = Object.assign(hook.data.meta || {}, { hasVideo: true });
        }
      } catch (err) {} // eslint-disable-line

      return resolve(hook);
    });
  };
};
