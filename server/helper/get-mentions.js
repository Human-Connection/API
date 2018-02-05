const mentionRegex = /data-hc-mention="([\s\S]+?)"/g;

const getMentions = async (app, content) => {
  let match = mentionRegex.exec(content);
  let mention = {};
  let mentionsTable = {};
  while (match !== null) {
    mention = JSON.parse(match[1].replace(/&quot;/g, '"'));
    if (!mentionsTable[mention._id]) {
      let mentionData = await app.service('users').get(mention._id);
      mentionsTable[mention._id] = mentionData;
    }
    match = mentionRegex.exec(content);
  }
  return mentionsTable;
};

module.exports = getMentions;