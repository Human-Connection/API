const contributionData = {
  title: 'a',
  type: 'post',
  content: 'My contribution content',
  language: 'en'
};

const contributionData2 = {
  title: 'b',
  type: 'post',
  content: 'My contribution content',
  language: 'en'
};

const contributionCandoData = {
  title: 'c',
  type: 'cando',
  content: 'My contribution content',
  language: 'en',
  cando: {
    difficulty: 'easy',
    reasonTitle: 'a',
    reason: 'My cando reason'
  }
};

module.exports = {
  contributionData,
  contributionData2,
  contributionCandoData
};