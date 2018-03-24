// get link metadata
// TODO: add more services and use the metascraper to fill some metadata on the article

const metascraper = require('metascraper').load([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-clearbit-logo')(),
  require('metascraper-logo-favicon')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')(),
  require('metascraper-youtube')(),
]);
const got = require('got');
const _ = require('lodash');

const getMetadata = async (targetUrl, app) => {
  const { body: html, url } = await got(targetUrl);
  app.debug(`getMetadata - getting metadata for ${url}`);
  // app.debug(html);
  // app.debug(html);
  const metadata = await metascraper({ html, url });
  // app.debug(metadata);
  app.debug(`getMetadata - got metadata for ${url}`);
  return metadata;
};

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

      if (!hook.data.meta) {
        hook.data.meta = {};
      }

      let promises = [];
      let embedds = {};

      try {
        // find links
        const youtubeRegex = new RegExp(/(?:(?:https?:)?\/\/)?(?:www\.)?youtu(?:be\.com\/(?:watch\?(?:.*?&(?:amp;)?)*v=|v\/|embed\/)|\.be\/)([\w‌​\-]+)(?:(?:&(?:amp;)?|\?)[\w\?=]*)*/, 'ig'); // eslint-disable-line
        const youtubeLinks = youtubeRegex.exec(hook.data.content);

        // html links
        const linkRegex = new RegExp(/<a\s[^>]*href=\"([^\"]*)\"[^>]*>([^<]*)<\/a>/, 'ig') // eslint-disable-line
        let match;
        while (match = linkRegex.exec(hook.data.content)) {
          const url = match[1];
          hook.app.debug(url);

          // skip if url already exists
          if (!_.isEmpty(embedds[url])) {
            continue;
          }
          // here you could scrape the url for metadata
          // hook.app.debug(match);
          promises.push(new Promise(async (resolve) => {
            try {
              const metadata = await getMetadata(url, hook.app);
              embedds[url] = metadata;
              return resolve(metadata);
            } catch (err) {
              hook.app.error('FAILED TO GRAB THE LINK');
              return resolve();
            }
          }));
        }

        if (youtubeLinks.length >= 2) {
          hook.data.teaserImg = `https://img.youtube.com/vi/${youtubeLinks[1]}/hqdefault.jpg`;
          hook.data.meta = Object.assign(hook.data.meta || {}, { hasVideo: true });
        }
      } catch (err) {} // eslint-disable-line

      return Promise.all(promises)
        .then(() => {
          hook.app.debug('embedds:');
          hook.app.debug(embedds);

          hook.data.meta.embedds = embedds;

          hook.app.debug('FINISHED!');
          resolve(hook);
        });
    });
  };
};
