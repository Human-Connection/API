const sanitizeHtml = require('sanitize-html');
const _ = require('lodash');

function clean (dirty, hook) {
  return sanitizeHtml(dirty, {
    allowedTags: ['iframe', 'img', 'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'pre', 'ul', 'li', 'ol'],
    allowedAttributes: {
      a: ['href', 'data-*'],
      img: [ 'src' ],
      iframe: ['src', 'class', 'frameborder', 'allowfullscreen']
    },
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
    parser: {
      lowerCaseTags: true
    }
    // transformTags: {
    //   'img': function (tagName, attribs) {
    //     let src = attribs.src;

    //     const config = hook.app.get('thumbor');
    //     if (config && src.indexOf(config < 0)) {
    //       // download image

    //       // make thumbnail

    //       // const ThumborUrlHelper = require('../helper/thumbor-helper');
    //       // const Thumbor = new ThumborUrlHelper(config.key || null, config.url || null);
    //       // src = Thumbor
    //       //   .setImagePath(src)
    //       //   .buildUrl('740x0');
    //     }
    //     return {
    //       tagName: 'img',
    //       attribs: {
    //         src: src
    //       }
    //     };
    //   }
    // }
  });
}

module.exports = function (options = { fields: [] }) {
  return function (hook) {
    return new Promise(resolve => {
      options.fields.forEach(field => {
        try {
          if (!_.isEmpty(hook.result) && !_.isEmpty(hook.result[field])) {
            hook.result[field] = clean(hook.result[field], hook);
          } else if (!_.isEmpty(hook.result) && !_.isEmpty(hook.result.data)) {
            hook.result.data.forEach((result, i) => {
              if (!_.isEmpty(hook.result.data[i][field])) {
                hook.result.data[i][field] = clean(hook.result.data[i][field], hook);
              }
            });
          } else if (!_.isEmpty(hook.data) && !_.isEmpty(hook.data[field])) {
            hook.data[field] = clean(hook.data[field], hook);
          }
        } catch (err) {
          hook.app.error(err);
        }
      });

      resolve(hook);
    });
  };
};
